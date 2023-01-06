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
} from "../types";
import {
  fromFlexpaToEntityAllergyIntoleranceList,
  fromFlexpaToEntityMedicationRequestList,
  fromFlexpaToEntityMedicationDispenseList,
  fromFlexpaToEntityImmunization,
  fromFlexpaToEntityConditionList,
  fromFlexpaToEntityProcedureList,
  fromFlexpaToEntityImmunizationList,
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

const medicationRequestCapability = "MedicationRequest";
const medicationDispenseCapbility = "MedicationDispense";
const procedureCapability = "Procedure";
const immunizationCapability = "Immunization";
const conditionCapability = "Condition";
const allergyIntoleranceCapability = "AllergyIntolerance";
const encounterCapability = "Encounter";

export const getClaimsDataByUserUid = async (
  userUid: string
): Promise<ClaimsData> => {
  // check the userUid profile. If it's a provider then get all
  // get all claims data with the userUid
  const claimsResults = await Promise.allSettled([
    getClaimsConditionByUserUid(userUid),
    getClaimsProcedureByUserUid(userUid),
    getClaimsImmunizationByUserUid(userUid),
    getClaimsAllergyIntoleranceByUserUid(userUid),
    getClaimsMedicationRequestByUserUid(userUid),
    getClaimsMedicationDispenseByUserUid(userUid),
  ]);
  const claimsData = extractClaimsResultsFromPromises(claimsResults);

  const derivedMedications = deriveClaimsMedications(
    claimsData.medicationRequest,
    claimsData.medicationDispense
  );
  claimsData.derivedClaimsMedications = derivedMedications;
  return claimsData;
  //
};

export const getClaimsConditionByUserUid = async (userUid: string) => {
  return new Promise(async (res, rej) => {
    try {
      const claimsValues = await insuranceRepo.getClaimsConditionByUserUid(
        userUid
      );
      res({ type: CONDITION, values: claimsValues });
    } catch (e) {
      rej(e);
    }
  });
};
export const getClaimsProcedureByUserUid = async (userUid: string) => {
  return new Promise(async (res, rej) => {
    try {
      const claimsValues = await insuranceRepo.getClaimsProcedureByUserUid(
        userUid
      );
      res({ type: PROCEDURE, values: claimsValues });
    } catch (e) {
      rej(e);
    }
  });
};

export const getClaimsImmunizationByUserUid = async (userUid: string) => {
  return new Promise(async (res, rej) => {
    try {
      const claimsValues = await insuranceRepo.getClaimsImmunizationByUserUid(
        userUid
      );
      res({ type: IMMUNIZATION, values: claimsValues });
    } catch (e) {
      rej(e);
    }
  });
};

export const getClaimsAllergyIntoleranceByUserUid = async (userUid: string) => {
  return new Promise(async (res, rej) => {
    try {
      const claimsValues =
        await insuranceRepo.getClaimsAllergyIntoleranceByUserUid(userUid);
      res({ type: ALLERGY_INTOLERANCE, values: claimsValues });
    } catch (e) {
      rej(e);
    }
  });
};

export const getClaimsMedicationRequestByUserUid = async (userUid: string) => {
  return new Promise(async (res, rej) => {
    try {
      const claimsValues =
        await insuranceRepo.getClaimsMedicationRequestByUserUid(userUid);
      res({ type: MEDICATION_REQUEST, values: claimsValues });
    } catch (e) {
      rej(e);
    }
  });
};

export const getClaimsMedicationDispenseByUserUid = async (userUid: string) => {
  return new Promise(async (res, rej) => {
    try {
      const claimsValues =
        await insuranceRepo.getClaimsMedicationDispenseByUserUid(userUid);
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

    console.log("ADDING THE INSURANCE PROVIDER");
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
  derivedMedHistory.date = medReq.authoredOn;
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
  derivedMedHistory.date = medDis.whenHandedOver;
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
      (a: MedicationRequest, b: MedicationRequest) =>
        new Date(b.authoredOn).valueOf() - new Date(a.authoredOn).valueOf()
    );
    medContext.dispense = medContext.dispense.sort(
      (a: MedicationDispense, b: MedicationDispense) =>
        new Date(b.whenHandedOver).valueOf() -
        new Date(a.whenHandedOver).valueOf()
    );

    medContext.derivedHistory = medContext.derivedHistory.sort(
      (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()
    );

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

/*

const combinedRequestAndDispense = (request, dispense) => {
  for (let i = 0; i < request.length; i++) {
    request[i].date = request[i].authoredOn;
    request[i].type = "REQUEST";
    if (
      request[i].doseAndRateQuantityUnit &&
      request[i].doseAndRateQuantityValue
    ) {
      request[i].dose =
        request[i].doseAndRateQuantityUnit +
        " " +
        request[i].doseAndRateQuantityValue;
    }
  }

  for (let i = 0; i < dispense.length; i++) {
    dispense[i].date = dispense[i].whenHandedOver;
    dispense[i].type = "DISPENSE";
  }

  const combinedRequestAndDispense = [...request, ...dispense].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return combinedRequestAndDispense;
};
*/

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
      res("GOT IT");
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

export const getAllergyIntolerance = (
  accessToken: string,
  insuranceProviderUid: string
) => {
  return new Promise(async (res, rej) => {
    try {
      const flexpaAllergyIntolerance =
        await flexpaGateway.getAllergyIntolerance(accessToken);

      const allergyIntoleranceEntityList =
        fromFlexpaToEntityAllergyIntoleranceList(flexpaAllergyIntolerance);

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

      const immunizationsEntityList = fromFlexpaToEntityImmunizationList(
        flexpaImmunizationList
      );

      res({ type: IMMUNIZATION, values: immunizationsEntityList });
    } catch (e) {
      console.log(e);
      rej(e);
    }
  });
};

export const getProcedures = (
  accessToken: string,
  insuranceProviderUid: string
) => {
  return new Promise(async (res, rej) => {
    try {
      const flexpaProceduresList = await flexpaGateway.getProcedures(
        accessToken
      );

      const proceduresEntityList =
        fromFlexpaToEntityProcedureList(flexpaProceduresList);

      res({ type: PROCEDURE, values: proceduresEntityList });
    } catch (e) {
      console.log(e);
      rej(e);
    }
  });
};

export const saveNote = async (note: Note) => {
  const savedNote = await insuranceRepo.saveNote(note);
  return savedNote;
};

// uid?: string;
// userUid?: string;
// type?: string; // MEDICATION, ALLERGY, etc
// text?: string; // note text
// medicationCode?: string;
// parentUid?: string; // what it's a note for
