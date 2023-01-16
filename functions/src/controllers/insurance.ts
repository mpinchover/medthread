import { getAccessToken, getMetadata } from "../gateway/flepxa";
import * as insuranceRepo from "../repo/insurance";
import * as medicationsRepo from "../repo/medications";
import * as flexpaGateway from "../gateway/flepxa";
import * as medicationsController from "../controllers/medications";
import {
  InsuranceMetadata,
  InsuranceProvider,
  AddHealthInsuranceProviderResponse,
  Medication,
  AllergyIntolerance,
  MedicationRequest,
  ClaimsData,
  MedicationDispense,
  DerivedMedication,
  Condition,
  Note,
  MedContext,
  DerivedMedicationHistory,
  TimelineEvent,
  Procedure,
  Encounter,
  PatientRecordsQueryFilter,
  ExplanationOfBenefit,
} from "../types";
import {
  fromFlexpaToEntityAllergyIntoleranceList,
  fromFlexpaToEntityMedicationRequestList,
  fromFlexpaToEntityMedicationDispenseList,
  fromFlexpaToEntityImmunization,
  fromFlexpaToEntityConditionList,
  fromFlexpaToEntityProcedureList,
  fromFlexpaToEntityImmunizationList,
  fromFlexpaToEntityEncounterList,
  fromFlexpaToEntityObservationList,
  fromFlexpaToEntityCareTeamList,
  setEncounterPrimaryDate,
  setProcedurePrimaryDate,
  fromFlexpaToEntityEOBList,
  fromFlexpaToEntityProcedure,
} from "../mappers/flexpa-to-entity";
import { promises } from "nodemailer/lib/xoauth2";
import { stringify } from "uuid";

const MEDICATION_REQUEST = "MEDICATION_REQUEST";
const ALLERGY_INTOLERANCE = "ALLERGY_INTOLERANCE";
const MEDICATION_DISPENSE = "MEDICATION_DISPENSE";
const PROCEDURE = "PROCEDURE";
const IMMUNIZATION = "IMMUNIZATIONS";
const CONDITION = "CONDITION";
const ENCOUNTER = "ENCOUNTER";
const CARE_TEAM = "CARE_TEAM";
const OBSERVATION = "OBSERVATION";
const EXPLANATION_OF_BENEFIT = "EXPLANATION_OF_BENEFIT";

const medicationRequestCapability = "MedicationRequest";
const medicationDispenseCapbility = "MedicationDispense";
const procedureCapability = "Procedure";
const immunizationCapability = "Immunization";
const conditionCapability = "Condition";
const allergyIntoleranceCapability = "AllergyIntolerance";
const encounterCapability = "Encounter";
const careTeamCapability = "CareTeam";
const observationCapability = "Observation";
const explanationOfBenefitCapability = "ExplanationOfBenefit";

export const getPatientTimeline = async (filter: PatientRecordsQueryFilter) => {
  const timelineResults = await Promise.allSettled([
    getClaimsEncounterByFilter(filter),
    getClaimsProcedureByFilter(filter),
  ]);

  let timelineEvents: TimelineEvent[] = [];
  for (let i = 0; i < timelineResults.length; i++) {
    const result: any = timelineResults[i];
    if (result.status === "rejected") {
      // TODO –  log here
      continue;
    }

    // check what the type is
    const convertedTimelineEvents = toTimelineEvents(
      result.value.values,
      result.value.type
    );
    timelineEvents.push(...convertedTimelineEvents);
  }

  timelineEvents = timelineEvents.sort((a, b) => {
    return (
      new Date(b.primaryDate).valueOf() - new Date(a.primaryDate).valueOf()
    );
  });
  return timelineEvents;
};

// take in a claims data array and covnert it to a timeline event
const toTimelineEvents = (events: [], type: string): TimelineEvent[] => {
  const timelineEvents: TimelineEvent[] = [];
  events.forEach((e: any) => {
    const event: TimelineEvent = {
      primaryDate: e.primaryDate,
      event: e,
      type,
    };
    timelineEvents.push(event);
  });
  return timelineEvents;
};

export const getClaimsDataByUserUid = async (
  filter: PatientRecordsQueryFilter
): Promise<ClaimsData> => {
  // check the userUid profile. If it's a provider then get all
  // get all claims data with the userUid
  const claimsResults = await Promise.allSettled([
    getClaimsConditionByFilter(filter),
    getClaimsProcedureByFilter(filter),
    getClaimsImmunizationByFilter(filter),
    getClaimsAllergyIntoleranceByFilter(filter),
    getClaimsMedicationRequestByFilter(filter),
    getClaimsMedicationDispenseByFilter(filter),
  ]);
  const claimsData = extractClaimsResultsFromPromises(claimsResults);

  // sort everything
  claimsData.allergyIntolerance = claimsData.allergyIntolerance.sort((a, b) => {
    if (!b.recordedDate && a.recordedDate) return -1;
    if (!a.recordedDate && b.recordedDate) return 1;
    if (!a.recordedDate && !b.recordedDate) return 0;
    return (
      new Date(b.recordedDate).valueOf() - new Date(a.recordedDate).valueOf()
    );
  });
  claimsData.immunization = claimsData.immunization.sort((a, b) => {
    if (!b.occurenceDateTime && a.occurenceDateTime) return -1;
    if (!a.occurenceDateTime && b.occurenceDateTime) return 1;
    if (!a.occurenceDateTime && !b.occurenceDateTime) return 0;
    return (
      new Date(b.occurenceDateTime).valueOf() -
      new Date(a.occurenceDateTime).valueOf()
    );
  });
  claimsData.procedure = claimsData.procedure.sort((a, b) => {
    if (!b.performedDateTime && a.performedDateTime) return -1;
    if (!a.performedDateTime && b.performedDateTime) return 1;
    if (!a.performedDateTime && !b.performedDateTime) return 0;
    return (
      new Date(b.performedDateTime).valueOf() -
      new Date(a.performedDateTime).valueOf()
    );
  });

  // TODO – sort medications by last med prescribed

  claimsData.encounter = claimsData.encounter.sort((a, b) => {
    if (!b.start && a.start) return -1;
    if (!a.start && b.start) return 1;
    if (!a.start && !b.start) return 0;
    return new Date(b.start).valueOf() - new Date(a.start).valueOf();
  });
  claimsData.observation = claimsData.observation.sort((a, b) => {
    if (!b.issued && a.issued) return -1;
    if (!a.issued && b.issued) return 1;
    if (!a.issued && !b.issued) return 0;
    return new Date(b.issued).valueOf() - new Date(a.issued).valueOf();
  });

  const derivedMedications = deriveClaimsMedications(
    claimsData.medicationRequest,
    claimsData.medicationDispense
  );
  claimsData.derivedClaimsMedications = derivedMedications;
  return claimsData;
  //
};

export const getClaimsEncounterByFilter = async (
  filter: PatientRecordsQueryFilter
) => {
  return new Promise(async (res, rej) => {
    try {
      if (!filter.encounter) {
        res({ type: ENCOUNTER, values: [] });
      }

      // if everything is selected, them just don't filter by any types
      const claimsValues = await insuranceRepo.getClaimsEncounterByUserUid(
        filter
      );
      for (let i = 0; i < claimsValues.length; i++) {
        setEncounterPrimaryDate(claimsValues[i]);
      }

      res({ type: ENCOUNTER, values: claimsValues });
    } catch (e) {
      rej(e);
    }
  });
};

export const getClaimsConditionByFilter = async (
  filter: PatientRecordsQueryFilter
) => {
  return new Promise(async (res, rej) => {
    try {
      const claimsValues = await insuranceRepo.getClaimsConditionByUserUid(
        filter
      );

      res({ type: CONDITION, values: claimsValues });
    } catch (e) {
      rej(e);
    }
  });
};

export const getClaimsProcedureByFilter = async (
  filter: PatientRecordsQueryFilter
) => {
  return new Promise(async (res, rej) => {
    try {
      if (!filter.procedure) {
        res({ type: PROCEDURE, values: [] });
      }
      const claimsValues = await insuranceRepo.getClaimsProcedureByUserUid(
        filter
      );

      for (let i = 0; i < claimsValues.length; i++) {
        setProcedurePrimaryDate(claimsValues[i]);
      }

      res({ type: PROCEDURE, values: claimsValues });
    } catch (e) {
      rej(e);
    }
  });
};

export const getClaimsImmunizationByFilter = async (
  filter: PatientRecordsQueryFilter
) => {
  return new Promise(async (res, rej) => {
    try {
      const claimsValues = await insuranceRepo.getClaimsImmunizationByUserUid(
        filter
      );
      res({ type: IMMUNIZATION, values: claimsValues });
    } catch (e) {
      rej(e);
    }
  });
};

export const getClaimsAllergyIntoleranceByFilter = async (
  filter: PatientRecordsQueryFilter
) => {
  return new Promise(async (res, rej) => {
    try {
      const claimsValues =
        await insuranceRepo.getClaimsAllergyIntoleranceByUserUid(filter);
      res({ type: ALLERGY_INTOLERANCE, values: claimsValues });
    } catch (e) {
      rej(e);
    }
  });
};

export const getClaimsMedicationRequestByFilter = async (
  filter: PatientRecordsQueryFilter
) => {
  return new Promise(async (res, rej) => {
    try {
      const claimsValues =
        await insuranceRepo.getClaimsMedicationRequestByUserUid(filter);
      res({ type: MEDICATION_REQUEST, values: claimsValues });
    } catch (e) {
      rej(e);
    }
  });
};

export const getClaimsMedicationDispenseByFilter = async (
  filter: PatientRecordsQueryFilter
) => {
  return new Promise(async (res, rej) => {
    try {
      const claimsValues =
        await insuranceRepo.getClaimsMedicationDispenseByUserUid(filter);
      res({ type: MEDICATION_DISPENSE, values: claimsValues });
    } catch (e) {
      rej(e);
    }
  });
};

export const addHealthInsuranceProvider = async (
  userUid: string,
  publicToken: string
): Promise<AddHealthInsuranceProviderResponse> => {
  try {
    const accessToken = await getAccessToken(publicToken);
    const metadata: InsuranceMetadata = await getMetadata(accessToken);

    // check to see if we've already added this health insurance provider
    const existingInsuranceprovider =
      await insuranceRepo.getInsuranceProviderByUserUidAndName(
        metadata.publisher,
        userUid
      );

    // if this health insurance provider exists, just return it
    if (existingInsuranceprovider) {
      const res: AddHealthInsuranceProviderResponse = {
        insuranceProvider: existingInsuranceprovider,
      };
      return res;
    }
    // TODO – add a condition here to solve this.
    // if we are adding a health insurance provider now, we still want to get new details
    // in the future. So we don't want to just return it here.

    // TODO – make sure not to refresh the data

    // TODO – batch the insurance provider creation with the claims data creation
    // create the new health insurance provider
    const newProviderParams: InsuranceProvider = {
      userUid,
      accessToken,
      providerName: metadata.publisher,
      capabilities: metadata.capabilities,
    };

    const newProvider = await insuranceRepo.addInsuranceProviderForPatient(
      newProviderParams
    );

    // TODO – test this
    const claimsData = await getClaimsFromInsuranceProvider(newProvider);

    appendInsuranceAndUserUidToClaims(claimsData, newProvider);
    // TODO – make sure not to save duplicates
    const savedClaimsData = await insuranceRepo.batchWriteClaimsData(
      claimsData
    );

    const derivedClaimsMedications = deriveClaimsMedications(
      savedClaimsData.medicationRequest,
      savedClaimsData.medicationDispense
    );

    savedClaimsData.derivedClaimsMedications = derivedClaimsMedications;
    const res: AddHealthInsuranceProviderResponse = {
      insuranceProvider: newProvider,
      claimsData: savedClaimsData,
    };
    return res;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
// TODO – put this in a loop
export const appendInsuranceAndUserUidToClaims = (
  claimsData: ClaimsData,
  insuranceProvider: InsuranceProvider
) => {
  const userUid = insuranceProvider.userUid;
  const providerUid = insuranceProvider.uid;

  _appendInsuranceAndUseUidToClaims(
    userUid,
    providerUid,
    claimsData.medicationRequest
  );

  _appendInsuranceAndUseUidToClaims(
    userUid,
    providerUid,
    claimsData.medicationDispense
  );

  _appendInsuranceAndUseUidToClaims(
    userUid,
    providerUid,
    claimsData.allergyIntolerance
  );

  _appendInsuranceAndUseUidToClaims(userUid, providerUid, claimsData.condition);

  _appendInsuranceAndUseUidToClaims(userUid, providerUid, claimsData.procedure);

  _appendInsuranceAndUseUidToClaims(
    userUid,
    providerUid,
    claimsData.immunization
  );

  _appendInsuranceAndUseUidToClaims(userUid, providerUid, claimsData.encounter);

  _appendInsuranceAndUseUidToClaims(
    userUid,
    providerUid,
    claimsData.observation
  );

  _appendInsuranceAndUseUidToClaims(userUid, providerUid, claimsData.careTeam);
  _appendInsuranceAndUseUidToClaims(
    userUid,
    providerUid,
    claimsData.explanationOfBenefit
  );
};

export const _appendInsuranceAndUseUidToClaims = (
  userUid: string,
  providerUid: string,
  values: any[]
) => {
  for (let i = 0; i < values.length; i++) {
    values[i].insuranceProviderUid = providerUid;
    values[i].userUid = userUid;
  }
};

// TODO - move to mappers
export const medRequestToDerivedMedHistory = (medReq: MedicationRequest) => {
  const derivedMedHistory: DerivedMedicationHistory = {};
  derivedMedHistory.date = medReq.primaryDate;
  derivedMedHistory.type = "REQUEST";

  const doseAndRateQuantityUnit = medReq.doseAndRateQuantityUnit
    ? medReq.doseAndRateQuantityUnit
    : "";
  const doseAndRateQuantityValue = medReq.doseAndRateQuantityValue
    ? medReq.doseAndRateQuantityValue
    : "";
  derivedMedHistory.dosage =
    doseAndRateQuantityValue + " " + doseAndRateQuantityUnit;
  return derivedMedHistory;
};

// TODO - move to mappers
export const medDispenseToDerivedMedHistory = (medDis: MedicationDispense) => {
  const derivedMedHistory: DerivedMedicationHistory = {};
  derivedMedHistory.date = medDis.primaryDate;
  derivedMedHistory.type = "DISPENSE";
  derivedMedHistory.daysSupply = medDis.daysSupply;

  const quantityValue = medDis.quantityValue ? medDis.quantityValue : "";
  const quantityUnit = medDis.quantityUnit ? medDis.quantityUnit : "";
  derivedMedHistory.quantity = quantityUnit + " " + quantityValue;

  return derivedMedHistory;
};

// TODO - change the response to a new type and dont send med req/dispense
export const deriveClaimsMedications = (
  medRequest: MedicationRequest[],
  medDispense: MedicationDispense[]
): DerivedMedication[] => {
  const derivedMedications: DerivedMedication[] = [];
  const medicationMap = new Map<string, MedContext>();

  // group the medications by med request and med dispense
  // so med code -> {med req, med dispense}
  // we may have some meds with only the dispense and some with only the req
  for (let i = 0; i < medRequest.length; i++) {
    const medReq = medRequest[i];

    if (!medReq.code) continue;
    if (!medicationMap.has(medReq.code)) {
      const medContext: MedContext = {
        request: [],
        dispense: [],
        derivedHistory: [],
      };
      medicationMap.set(medReq.code, medContext);
    }
    const derivedMedHistoryItem = medRequestToDerivedMedHistory(medReq);
    medicationMap.get(medReq.code).request.push(medReq);
    medicationMap.get(medReq.code).derivedHistory.push(derivedMedHistoryItem);
  }

  for (let i = 0; i < medDispense.length; i++) {
    const medDis = medDispense[i];

    if (!medDis.code) continue;
    if (!medicationMap.has(medDis.code)) {
      const medContext: MedContext = {
        request: [],
        dispense: [],
        derivedHistory: [],
      };
      medicationMap.set(medDis.code, medContext);
    }
    const derivedMedHistoryItem = medDispenseToDerivedMedHistory(medDis);

    medicationMap.get(medDis.code).dispense.push(medDis);
    medicationMap.get(medDis.code).derivedHistory.push(derivedMedHistoryItem);
  }

  const medContextValues = Array.from(medicationMap.values());
  for (let i = 0; i < medContextValues.length; i++) {
    const medContext = medContextValues[i];

    // sort the request, dispense into descending order by date
    medContext.request = medContext.request.sort(
      (a: MedicationRequest, b: MedicationRequest) => {
        if (!b.primaryDate && a.primaryDate) return -1;
        if (!a.primaryDate && b.primaryDate) return 1;
        if (!a.primaryDate && !b.primaryDate) return 0;
        return (
          new Date(b.primaryDate).valueOf() - new Date(a.primaryDate).valueOf()
        );
      }
    );
    medContext.dispense = medContext.dispense.sort(
      (a: MedicationDispense, b: MedicationDispense) => {
        if (!b.primaryDate && a.primaryDate) return -1;
        if (!a.primaryDate && b.primaryDate) return 1;
        if (!a.primaryDate && !b.primaryDate) return 0;
        return (
          new Date(b.primaryDate).valueOf() - new Date(a.primaryDate).valueOf()
        );
      }
    );

    medContext.derivedHistory = medContext.derivedHistory.sort((a, b) => {
      if (!b.date && a.date) return -1;
      if (!a.date && b.date) return 1;
      if (!a.date && !b.date) return 0;
      return new Date(b.date).valueOf() - new Date(a.date).valueOf();
    });

    const derivedMedication: DerivedMedication = {
      request: medContext.request,
      dispense: medContext.dispense,
      derivedMedicationHistory: medContext.derivedHistory,
    };

    // TODO – add in a first requested as well
    const firstFill = getFirstFill(medContext);
    if (firstFill) derivedMedication.firstFillOn = firstFill;

    const lastFill = getLastFill(medContext);
    if (lastFill) derivedMedication.lastFillOn = lastFill;

    const lastRequested = getLastRequested(medContext);
    if (lastRequested) derivedMedication.lastRequestedOn = lastRequested;

    const firstRequested = getFirstRequestedOn(medContext);
    if (firstRequested) derivedMedication.firstRequestedOn = firstRequested;

    const codeDisplay = getCodeDisplayFromMedContext(medContext);
    if (codeDisplay) derivedMedication.codeDisplay = codeDisplay;

    const code = getCodeFromMedContext(medContext);
    if (code) derivedMedication.code = code;

    if (medContextHasData(medContext)) {
      derivedMedications.push(derivedMedication);
    }
  }
  return derivedMedications;
};

const getLastFill = (medContext: MedContext) => {
  return medContext?.dispense?.[0]?.whenHandedOver;
};

const getFirstFill = (medContext: MedContext) => {
  return medContext?.dispense?.[medContext?.dispense?.length - 1]
    ?.whenHandedOver;
};

const getLastRequested = (medContext: MedContext) => {
  return medContext?.request?.[0]?.authoredOn;
};

const getFirstRequestedOn = (medContext: MedContext) => {
  return medContext?.request?.[medContext?.request?.length - 1]?.authoredOn;
};

const getCodeDisplayFromMedContext = (medContext: MedContext) => {
  if (medContext?.request?.[0]?.codeDisplay)
    return medContext?.request?.[0]?.codeDisplay;
  return medContext?.dispense?.[0]?.codeDisplay;
};

const getCodeFromMedContext = (medContext: MedContext) => {
  if (medContext?.request?.[0]?.code) return medContext?.request?.[0]?.code;
  return medContext?.dispense?.[0]?.code;
};

const medContextHasData = (medContext: MedContext) => {
  return Object.keys(medContext).length > 0;
};

// get all claims data from insurance provider
export const getClaimsFromInsuranceProvider = async (
  insuranceProvider: InsuranceProvider
): Promise<ClaimsData> => {
  // TOOD – if it fails, you shouldn't add the insurance provdier
  // TODO – add encounters, care team, etc

  const concurrentPromisesToExecute = [];
  if (insuranceProvider.capabilities.includes(medicationRequestCapability)) {
    concurrentPromisesToExecute.push(getMedicationRequests);
  }

  if (insuranceProvider.capabilities.includes(medicationDispenseCapbility)) {
    concurrentPromisesToExecute.push(getMedicationDispense);
  }

  if (insuranceProvider.capabilities.includes(procedureCapability)) {
    concurrentPromisesToExecute.push(getProcedures);
  }

  if (insuranceProvider.capabilities.includes(immunizationCapability)) {
    concurrentPromisesToExecute.push(getImmunizations);
  }

  if (insuranceProvider.capabilities.includes(conditionCapability)) {
    concurrentPromisesToExecute.push(getConditions);
  }

  if (insuranceProvider.capabilities.includes(allergyIntoleranceCapability)) {
    concurrentPromisesToExecute.push(getAllergyIntolerance);
  }

  if (insuranceProvider.capabilities.includes(encounterCapability)) {
    concurrentPromisesToExecute.push(getEncounter);
  }

  if (insuranceProvider.capabilities.includes(careTeamCapability)) {
    concurrentPromisesToExecute.push(getCareTeam);
  }

  if (insuranceProvider.capabilities.includes(observationCapability)) {
    concurrentPromisesToExecute.push(getObservation);
  }

  if (insuranceProvider.capabilities.includes(explanationOfBenefitCapability)) {
    concurrentPromisesToExecute.push(
      getExplanationOfBenefitFromFlexpaInPromise
    );
  }

  const claimsResults = await Promise.allSettled(
    concurrentPromisesToExecute.map((fn) =>
      fn(insuranceProvider.accessToken, insuranceProvider.uid)
    )
  );

  const claimsData = extractClaimsResultsFromPromises(claimsResults);

  return claimsData;
};

export const extractClaimsResultsFromPromises = (
  claimsResults: any[]
): ClaimsData => {
  const claimsData: ClaimsData = {
    medicationRequest: [],
    allergyIntolerance: [],
    medicationDispense: [],
    immunization: [],
    condition: [],
    procedure: [],
    encounter: [],
    careTeam: [],
    observation: [],
    explanationOfBenefit: [],
  };

  for (let i = 0; i < claimsResults.length; i++) {
    const promiseResult: any = claimsResults[i];
    if (promiseResult.status === "rejected") {
      continue;
    }

    const type = promiseResult.value.type;
    const values = promiseResult.value.values;

    if (type === MEDICATION_REQUEST) {
      claimsData.medicationRequest = values;
    } else if (type === ALLERGY_INTOLERANCE) {
      claimsData.allergyIntolerance = values;
    } else if (type === MEDICATION_DISPENSE) {
      claimsData.medicationDispense = values;
    } else if (type === PROCEDURE) {
      claimsData.procedure = values;
    } else if (type === CONDITION) {
      claimsData.condition = values;
    } else if (type === IMMUNIZATION) {
      claimsData.immunization = values;
    } else if (type === ENCOUNTER) {
      claimsData.encounter = values;
    } else if (type === OBSERVATION) {
      claimsData.observation = values;
    } else if (type === CARE_TEAM) {
      claimsData.careTeam = values;
    } else if (type === EXPLANATION_OF_BENEFIT) {
      claimsData.explanationOfBenefit = values;
    }
  }
  return claimsData;
};

export const getMedicationRequests = (
  accessToken: string,
  insuranceProviderUid: string
) => {
  return new Promise(async (res, rej) => {
    try {
      const flexpaMedRequest = await flexpaGateway.getMedicationRequest(
        accessToken
      );

      const entityMedRequestList =
        fromFlexpaToEntityMedicationRequestList(flexpaMedRequest);

      res({ type: MEDICATION_REQUEST, values: entityMedRequestList });
    } catch (e) {
      console.log(e);
      rej(e);
    }
  });
};

export const getEncounter = (accessToken: string) => {
  return new Promise(async (res, rej) => {
    try {
      const flexpaEncounters = await flexpaGateway.getEncounter(accessToken);

      let entityEncounterList =
        fromFlexpaToEntityEncounterList(flexpaEncounters);

      entityEncounterList = entityEncounterList.sort((a, b) => {
        if (!b.primaryDate && a.primaryDate) return -1;
        if (!a.primaryDate && b.primaryDate) return 1;
        if (!a.primaryDate && !b.primaryDate) return 0;
        return (
          new Date(b.primaryDate).valueOf() - new Date(a.primaryDate).valueOf()
        );
      });

      res({ type: ENCOUNTER, values: entityEncounterList });
    } catch (e) {
      console.log(e);
      rej(e);
    }
  });
};

export const getMedicationDispense = (
  accessToken: string,
  insuranceProviderUid: string
) => {
  return new Promise(async (res, rej) => {
    try {
      const flexpaMedDispense = await flexpaGateway.getMedicationDispense(
        accessToken
      );

      const entityMedDispenseList =
        fromFlexpaToEntityMedicationDispenseList(flexpaMedDispense);

      res({ type: MEDICATION_DISPENSE, values: entityMedDispenseList });
    } catch (e) {
      console.log(e);
      rej(e);
    }
  });
};

export const getAllergyIntolerance = (accessToken: string) => {
  return new Promise(async (res, rej) => {
    try {
      const flexpaAllergyIntolerance =
        await flexpaGateway.getAllergyIntolerance(accessToken);

      let allergyIntoleranceEntityList =
        fromFlexpaToEntityAllergyIntoleranceList(flexpaAllergyIntolerance);

      allergyIntoleranceEntityList = allergyIntoleranceEntityList.sort(
        (a, b) => {
          if (!b.primaryDate && a.primaryDate) return -1;
          if (!a.primaryDate && b.primaryDate) return 1;
          if (!a.primaryDate && !b.primaryDate) return 0;
          return (
            new Date(b.primaryDate).valueOf() -
            new Date(a.primaryDate).valueOf()
          );
        }
      );

      // map it
      res({ type: ALLERGY_INTOLERANCE, values: allergyIntoleranceEntityList });
    } catch (e) {
      console.log(e);
      rej(e);
    }
  });
};

export const getConditions = (
  accessToken: string,
  insuranceProviderUid: string
) => {
  return new Promise(async (res, rej) => {
    try {
      const flexpaConditions = await flexpaGateway.getConditions(accessToken);

      const conditionsEntityList =
        fromFlexpaToEntityConditionList(flexpaConditions);

      res({ type: CONDITION, values: conditionsEntityList });
    } catch (e) {
      rej(e);
    }
  });
};

export const getImmunizations = (
  accessToken: string,
  insuranceProviderUid: string
) => {
  return new Promise(async (res, rej) => {
    try {
      const flexpaImmunizationList = await flexpaGateway.getImmunizations(
        accessToken
      );

      let immunizationsEntityList = fromFlexpaToEntityImmunizationList(
        flexpaImmunizationList
      );

      immunizationsEntityList = immunizationsEntityList.sort((a, b) => {
        if (!b.primaryDate && a.primaryDate) return -1;
        if (!a.primaryDate && b.primaryDate) return 1;
        if (!a.primaryDate && !b.primaryDate) return 0;
        return (
          new Date(b.primaryDate).valueOf() - new Date(a.primaryDate).valueOf()
        );
      });

      res({ type: IMMUNIZATION, values: immunizationsEntityList });
    } catch (e) {
      console.log(e);
      rej(e);
    }
  });
};

export const getProcedures = (accessToken: string) => {
  return new Promise(async (res, rej) => {
    try {
      const flexpaProceduresList = await flexpaGateway.getProcedures(
        accessToken
      );

      let proceduresEntityList =
        fromFlexpaToEntityProcedureList(flexpaProceduresList);

      proceduresEntityList = proceduresEntityList.sort((a, b) => {
        if (!b.primaryDate && a.primaryDate) return -1;
        if (!a.primaryDate && b.primaryDate) return 1;
        if (!a.primaryDate && !b.primaryDate) return 0;
        return (
          new Date(b.primaryDate).valueOf() - new Date(a.primaryDate).valueOf()
        );
      });

      res({ type: PROCEDURE, values: proceduresEntityList });
    } catch (e) {
      console.log(e);
      rej(e);
    }
  });
};

export const getCareTeam = (accessToken: string) => {
  return new Promise(async (res, rej) => {
    try {
      const flexpaCareTeamList = await flexpaGateway.getCareTeam(accessToken);

      const careTeamEntityList =
        fromFlexpaToEntityCareTeamList(flexpaCareTeamList);

      res({ type: CARE_TEAM, values: careTeamEntityList });
    } catch (e) {
      console.log(e);
      rej(e);
    }
  });
};

// TODO – create hydrated explanation of benefits
// get procedure and save them as a Procedure.
// then, map to fhir ref
// so when you pull you can get it.
//

export const getHydratedExplantionOfBenefitFromFlexpa = (
  accessToken: string
) => {
  return new Promise(async (res, rej) => {
    const entityListEOB = await getExplanationOfBenefitFromFlepxa(accessToken);

    // now iterate through all of the procedures and query them as well.
    const procedureReferences = extractProcedureRefsFromEOB(entityListEOB);
    const entityProcedures: Procedure[] = [];
    const procedureResults = await Promise.allSettled(
      procedureReferences.map((ref) => {
        return flexpaGateway.getFHIRResourceByReference(accessToken, ref);
      })
    );

    for (let i = 0; i < procedureResults.length; i++) {
      const result = procedureResults[i];
      if (result.status === "rejected") continue;
      const entityProcedure = fromFlexpaToEntityProcedure(result.value);
      entityProcedures.push(entityProcedure);
    }
    // reinsert the procedures by the fhir resource id

    // TODO – consider a way to not double query
    try {
    } catch (e) {
      rej(e);
    }
  });
};

export const extractProcedureRefsFromEOB = (
  eobs: ExplanationOfBenefit[]
): string[] => {
  const procedureReferences: string[] = [];
  eobs.forEach((eob) => {
    eob.procedure?.forEach((procedure) => {
      if (procedure.reference) {
        procedureReferences.push(procedure.reference);
      }
    });
  });
  return procedureReferences;
};

// https://stackoverflow.com/questions/40639432/what-is-the-best-way-to-limit-concurrency-when-using-es6s-promise-all
// limit concurrency
// flexpa resource id == the reference
export const getExplanationOfBenefitFromFlexpaInPromise = (
  accessToken: string
) => {
  return new Promise(async (res, rej) => {
    try {
      const entityListEOB = getExplanationOfBenefitFromFlepxa(accessToken);

      res({ type: EXPLANATION_OF_BENEFIT, values: entityListEOB });
    } catch (e) {
      console.log(e);
      rej(e);
    }
  });
};

export const getExplanationOfBenefitFromFlepxa = async (
  accessToken: string
): Promise<ExplanationOfBenefit[]> => {
  const flexpaEOB = await flexpaGateway.getExplanationOfBenefit(accessToken);
  let entityListEOB = fromFlexpaToEntityEOBList(flexpaEOB);

  // sort by primary date
  // you should also check any procedures here to be the primary date
  entityListEOB = entityListEOB.sort((a, b) => {
    if (!b.primaryDate && a.primaryDate) return -1;
    if (!a.primaryDate && b.primaryDate) return 1;
    if (!a.primaryDate && !b.primaryDate) return 0;
    return (
      new Date(b.primaryDate).valueOf() - new Date(a.primaryDate).valueOf()
    );
  });
  return entityListEOB;
};

export const getObservation = (accessToken: string) => {
  return new Promise(async (res, rej) => {
    try {
      const flexpaObservationList = await flexpaGateway.getObservation(
        accessToken
      );

      let observationEntityList = fromFlexpaToEntityObservationList(
        flexpaObservationList
      );

      observationEntityList = observationEntityList.sort((a, b) => {
        if (!b.primaryDate && a.primaryDate) return -1;
        if (!a.primaryDate && b.primaryDate) return 1;
        if (!a.primaryDate && !b.primaryDate) return 0;
        return (
          new Date(b.primaryDate).valueOf() - new Date(a.primaryDate).valueOf()
        );
      });

      res({ type: OBSERVATION, values: observationEntityList });
    } catch (e) {
      console.log(e);
      rej(e);
    }
  });
};
