import { getAccessToken, getMetadata } from "../gateway/flepxa";
import * as insuranceRepo from "../repo/insurance";
// import * as medicationsRepo from "../repo/medications";
import * as flexpaGateway from "../gateway/flepxa";
// import * as medicationsController from "../controllers/medications";
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
  MedContext,
  DerivedMedicationHistory,
  Procedure,
  Encounter,
  PatientRecordsQueryFilter,
  ExplanationOfBenefit,
} from "../types/types";
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
  setEOBPrimaryDate,
  fromFlexpaReferenceProcedureToEntityProcedure,
} from "../mappers/flexpa-to-entity";
import { promises } from "nodemailer/lib/xoauth2";
import * as constants from "../config/constants";
import * as functions from "firebase-functions";
import * as uuid from "uuid";

export const getPatientTimeline = async (filter: PatientRecordsQueryFilter) => {
  let timeline = await getTimelineClaimsExplanationOfBenefit(filter);
  timeline = timeline.filter((x: any) => !x.types?.includes("oral"));
  return timeline;
};

export const getClaimsDataByUserUuid = async (
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
        res({ type: constants.ENCOUNTER, values: [] });
      }

      // if everything is selected, them just don't filter by any types
      const claimsValues = await insuranceRepo.getClaimsEncounterByUserUuid(
        filter
      );
      for (let i = 0; i < claimsValues.length; i++) {
        setEncounterPrimaryDate(claimsValues[i]);
      }

      res({ type: constants.ENCOUNTER, values: claimsValues });
    } catch (e) {
      rej(e);
    }
  });
};

export const getTimelineClaimsExplanationOfBenefit = async (
  filter: PatientRecordsQueryFilter
) => {
  // if everything is selected, them just don't filter by any types
  let explanationofBenefits =
    await insuranceRepo.getExplanationOfBenefitByUserUuid(filter);

  const procedureReferences = extractProcedureRefsFromEOB(
    explanationofBenefits
  );

  for (let i = 0; i < procedureReferences.length; i++) {
    procedureReferences[i] = procedureReferences[i].slice(
      procedureReferences[i].lastIndexOf("/") + 1
    );
  }

  const entityProcedures =
    await insuranceRepo.getProceduresByFhirReferencesInBatch(
      procedureReferences
    );

  for (let i = 0; i < entityProcedures.length; i++) {
    setProcedurePrimaryDate(entityProcedures[i]);
  }

  const procedureMap = new Map<string, Procedure>();
  entityProcedures.forEach((pro: Procedure) => {
    procedureMap.set(pro.fhirReference, pro);
  });

  // set the primary date
  for (let i = 0; i < explanationofBenefits.length; i++) {
    const eobItem = explanationofBenefits[i];
    eobItem.jsonResponse = null;
    setEOBPrimaryDate(eobItem);

    // iterate through the procedures
    const eobProcedures = eobItem.procedure;
    for (let j = 0; j < eobProcedures?.length; j++) {
      const p = eobProcedures[j];

      const ref: string = p.reference.slice(p.reference.lastIndexOf("/") + 1);
      if (procedureMap.has(ref)) {
        p.procedure = procedureMap.get(ref);
      }
    }
  }

  explanationofBenefits = explanationofBenefits.sort((a: any, b: any) => {
    if (!b.primaryDate && a.primaryDate) return -1;
    if (!a.primaryDate && b.primaryDate) return 1;
    if (!a.primaryDate && !b.primaryDate) return 0;
    return (
      new Date(b.primaryDate).valueOf() - new Date(a.primaryDate).valueOf()
    );
  });

  return explanationofBenefits;
};

export const getClaimsConditionByFilter = async (
  filter: PatientRecordsQueryFilter
) => {
  return new Promise(async (res, rej) => {
    try {
      const claimsValues = await insuranceRepo.getClaimsConditionByUserUuid(
        filter
      );

      res({ type: constants.CONDITION, values: claimsValues });
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
        res({ type: constants.PROCEDURE, values: [] });
      }
      const claimsValues = await insuranceRepo.getClaimsProcedureByUserUuid(
        filter
      );

      for (let i = 0; i < claimsValues.length; i++) {
        setProcedurePrimaryDate(claimsValues[i]);
      }

      res({ type: constants.PROCEDURE, values: claimsValues });
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
      const claimsValues = await insuranceRepo.getClaimsImmunizationByUserUuid(
        filter
      );
      res({ type: constants.IMMUNIZATION, values: claimsValues });
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
        await insuranceRepo.getClaimsAllergyIntoleranceByUserUuid(filter);
      res({ type: constants.ALLERGY_INTOLERANCE, values: claimsValues });
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
        await insuranceRepo.getClaimsMedicationRequestByUserUuid(filter);
      res({ type: constants.MEDICATION_REQUEST, values: claimsValues });
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
        await insuranceRepo.getClaimsMedicationDispenseByUserUuid(filter);
      res({ type: constants.MEDICATION_DISPENSE, values: claimsValues });
    } catch (e) {
      rej(e);
    }
  });
};

export const addHealthInsuranceProvider = async (
  userUuid: string,
  publicToken: string
): Promise<AddHealthInsuranceProviderResponse> => {
  try {
    const accessToken = await getAccessToken(publicToken);
    const metadata: InsuranceMetadata = await getMetadata(accessToken);

    // check to see if we've already added this health insurance provider
    const existingInsuranceprovider =
      await insuranceRepo.getInsuranceProviderByUserUuidAndName(
        metadata.publisher,
        userUuid
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
    const newProvider: InsuranceProvider = {
      userUuid,
      accessToken,
      providerName: metadata.publisher,
      capabilities: metadata.capabilities,
      uuid: uuid.v4(),
    };

    const repoProviderParams = JSON.parse(JSON.stringify(newProvider));
    repoProviderParams.capabilities = JSON.stringify(metadata.capabilities);

    await insuranceRepo.addInsuranceProviderForPatient(repoProviderParams);

    // TODO – test this
    const claimsData = await getClaimsFromInsuranceProvider(newProvider);

    appendInsuranceAndUserUuidToClaims(claimsData, newProvider);

    // TODO – make sure not to save duplicates
    await insuranceRepo.batchWriteClaimsData(claimsData);

    const derivedClaimsMedications = deriveClaimsMedications(
      claimsData.medicationRequest,
      claimsData.medicationDispense
    );

    claimsData.derivedClaimsMedications = derivedClaimsMedications;
    const res: AddHealthInsuranceProviderResponse = {
      insuranceProvider: newProvider,
      claimsData: claimsData,
    };
    return res;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
// TODO – put this in a loop
export const appendInsuranceAndUserUuidToClaims = (
  claimsData: ClaimsData,
  insuranceProvider: InsuranceProvider
) => {
  const userUuid = insuranceProvider.userUuid;
  const providerUuid = insuranceProvider.uuid;

  _appendInsuranceAndUserUuidToClaims(
    userUuid,
    providerUuid,
    claimsData.medicationRequest
  );

  _appendInsuranceAndUserUuidToClaims(
    userUuid,
    providerUuid,
    claimsData.medicationDispense
  );

  _appendInsuranceAndUserUuidToClaims(
    userUuid,
    providerUuid,
    claimsData.allergyIntolerance
  );

  _appendInsuranceAndUserUuidToClaims(
    userUuid,
    providerUuid,
    claimsData.condition
  );

  _appendInsuranceAndUserUuidToClaims(
    userUuid,
    providerUuid,
    claimsData.procedure
  );

  _appendInsuranceAndUserUuidToClaims(
    userUuid,
    providerUuid,
    claimsData.immunization
  );

  _appendInsuranceAndUserUuidToClaims(
    userUuid,
    providerUuid,
    claimsData.encounter
  );

  _appendInsuranceAndUserUuidToClaims(
    userUuid,
    providerUuid,
    claimsData.observation
  );

  _appendInsuranceAndUserUuidToClaims(
    userUuid,
    providerUuid,
    claimsData.careTeam
  );
  _appendInsuranceAndUserUuidToClaims(
    userUuid,
    providerUuid,
    claimsData.explanationOfBenefit
  );
};

export const _appendInsuranceAndUserUuidToClaims = (
  userUuid: string,
  providerUuid: string,
  values: any[]
) => {
  for (let i = 0; i < values.length; i++) {
    values[i].insuranceProviderUuid = providerUuid;
    values[i].userUuid = userUuid;
    values[i].uuid = uuid.v4();
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
      resourceType: constants.DERIVED_MEDICATION,
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
  const logger = functions.logger;
  const concurrentPromisesToExecute = [];
  if (
    insuranceProvider.capabilities.includes(
      constants.medicationRequestCapability
    )
  ) {
    concurrentPromisesToExecute.push(getMedicationRequests);
  }

  if (
    insuranceProvider.capabilities.includes(
      constants.medicationDispenseCapbility
    )
  ) {
    concurrentPromisesToExecute.push(getMedicationDispense);
  }

  if (insuranceProvider.capabilities.includes(constants.procedureCapability)) {
    concurrentPromisesToExecute.push(getProcedures);
  }

  if (
    insuranceProvider.capabilities.includes(constants.immunizationCapability)
  ) {
    concurrentPromisesToExecute.push(getImmunizations);
  }

  if (insuranceProvider.capabilities.includes(constants.conditionCapability)) {
    concurrentPromisesToExecute.push(getConditions);
  }

  if (
    insuranceProvider.capabilities.includes(
      constants.allergyIntoleranceCapability
    )
  ) {
    concurrentPromisesToExecute.push(getAllergyIntolerance);
  }

  if (insuranceProvider.capabilities.includes(constants.encounterCapability)) {
    concurrentPromisesToExecute.push(getEncounter);
  }

  if (insuranceProvider.capabilities.includes(constants.careTeamCapability)) {
    concurrentPromisesToExecute.push(getCareTeam);
  }

  if (
    insuranceProvider.capabilities.includes(constants.observationCapability)
  ) {
    concurrentPromisesToExecute.push(getObservation);
  }

  if (
    insuranceProvider.capabilities.includes(
      constants.explanationOfBenefitCapability
    )
  ) {
    concurrentPromisesToExecute.push(getHydratedExplantionOfBenefitFromFlexpa);
  }

  const claimsResults = await Promise.allSettled(
    concurrentPromisesToExecute.map((fn) =>
      fn(insuranceProvider.accessToken, insuranceProvider.uuid)
    )
  );

  logger.info({
    message: "CLAIMS RESULTS FROM ADDING PROVIDER",
    userUuid: insuranceProvider?.userUuid,
    data: claimsResults,
  });

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

  const procedureMap = new Map<string, Procedure>();

  for (let i = 0; i < claimsResults.length; i++) {
    const promiseResult: any = claimsResults[i];
    if (promiseResult.status === "rejected") {
      continue;
    }

    const type = promiseResult.value.type;
    const values = promiseResult.value.values;

    if (type === constants.MEDICATION_REQUEST) {
      claimsData.medicationRequest = values;
    } else if (type === constants.ALLERGY_INTOLERANCE) {
      claimsData.allergyIntolerance = values;
    } else if (type === constants.MEDICATION_DISPENSE) {
      claimsData.medicationDispense = values;
    } else if (type === constants.PROCEDURE) {
      values.forEach((proc: Procedure) => {
        if (proc.fhirReference) {
          procedureMap.set(proc.fhirReference, proc);
        }
      });
    } else if (type === constants.CONDITION) {
      claimsData.condition = values;
    } else if (type === constants.IMMUNIZATION) {
      claimsData.immunization = values;
    } else if (type === constants.ENCOUNTER) {
      claimsData.encounter = values;
    } else if (type === constants.OBSERVATION) {
      claimsData.observation = values;
    } else if (type === constants.CARE_TEAM) {
      claimsData.careTeam = values;
    } else if (type === constants.EXPLANATION_OF_BENEFIT) {
      const explanationOfBenefit: ExplanationOfBenefit[] =
        values.explanationOfBenefit;

      const procedures: Procedure[] = Array.from(values?.procedures?.values());

      procedures.forEach((proc: Procedure) => {
        if (proc.fhirReference) {
          procedureMap.set(proc.fhirReference, proc);
        }
      });
      claimsData.explanationOfBenefit = explanationOfBenefit;
    }
  }

  // get the procedures from EOB and procedures
  claimsData.procedure = Array.from(procedureMap.values());

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

      res({ type: constants.MEDICATION_REQUEST, values: entityMedRequestList });
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

      res({ type: constants.ENCOUNTER, values: entityEncounterList });
    } catch (e) {
      console.log(e);
      rej(e);
    }
  });
};

export const getMedicationDispense = (accessToken: string) => {
  return new Promise(async (res, rej) => {
    try {
      const flexpaMedDispense = await flexpaGateway.getMedicationDispense(
        accessToken
      );

      const entityMedDispenseList =
        fromFlexpaToEntityMedicationDispenseList(flexpaMedDispense);

      res({
        type: constants.MEDICATION_DISPENSE,
        values: entityMedDispenseList,
      });
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
      res({
        type: constants.ALLERGY_INTOLERANCE,
        values: allergyIntoleranceEntityList,
      });
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

      res({ type: constants.CONDITION, values: conditionsEntityList });
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

      res({ type: constants.IMMUNIZATION, values: immunizationsEntityList });
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

      res({ type: constants.PROCEDURE, values: proceduresEntityList });
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

      res({ type: constants.CARE_TEAM, values: careTeamEntityList });
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
    try {
      // get EOB
      const entityListEOB = await getExplanationOfBenefitFromFlepxa(
        accessToken
      );

      // extract all the procedure references from EOB
      const procedureReferences = extractProcedureRefsFromEOB(entityListEOB);
      const entityProcedures = new Map<string, Procedure>();

      // get all the procedure by fhir ref
      const procedureResults = await Promise.allSettled(
        procedureReferences.map((ref) => {
          return getFHIRResourceByReference(accessToken, ref);
        })
      );

      // convert to entity procedure
      for (let i = 0; i < procedureResults.length; i++) {
        const result = procedureResults[i];
        if (result.status === "rejected") continue;
        const entityProcedure = fromFlexpaReferenceProcedureToEntityProcedure(
          result.value
        );
        entityProcedures.set(entityProcedure.fhirReference, entityProcedure);
      }

      res({
        type: constants.EXPLANATION_OF_BENEFIT,
        values: {
          explanationOfBenefit: entityListEOB,
          procedures: entityProcedures,
        },
      });
    } catch (e) {
      console.log("ERROR IS");
      console.log(e);
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
      const entityListEOB = await getExplanationOfBenefitFromFlepxa(
        accessToken
      );

      console.log(entityListEOB);
      res({ type: constants.EXPLANATION_OF_BENEFIT, values: entityListEOB });
    } catch (e) {
      console.log(e);
      rej(e);
    }
  });
};

export const getFHIRResourceByReference = (
  accessToken: string,
  ref: string
) => {
  return new Promise(async (res, rej) => {
    try {
      const fhirResource = await flexpaGateway.getFHIRResourceByReference(
        accessToken,
        ref
      );

      res(fhirResource);
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

      res({ type: constants.OBSERVATION, values: observationEntityList });
    } catch (e) {
      console.log(e);
      rej(e);
    }
  });
};
