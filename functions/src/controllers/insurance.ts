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
} from "../types";
import {
  fromFlexpaToEntityMedications,
  fromFlexpaToEntityAllergyIntoleranceList,
  fromFlexpaToEntityMedicationRequestList,
  fromFlexpaToEntityMedicationDispenseList,
  fromFlexpaToEntityImmunization,
  fromFlexpaToEntityConditionList,
  fromFlexpaToEntityProcedureList,
  fromFlexpaToEntityImmunizationList,
} from "../mappers/flexpa-to-entity";
import { promises } from "nodemailer/lib/xoauth2";

const MEDICATION_REQUEST = "MEDICATION_REQUEST";
const ALLERGY_INTOLERANCE = "ALLERGY_INTOLERANCE";
const MEDICATION_DISPENSE = "MEDICATION_DISPENSE";
const PROCEDURE = "PROCEDURE";
const IMMUNIZATION = "IMMUNIZATIONS";
const CONDITION = "CONDITION";

const medicationRequestCapability = "MedicationRequest";
const medicationDispenseCapbility = "MedicationDispense";
const procedureCapability = "Procedure";
const immunizationCapability = "Immunization";
const conditionCapability = "Condition";
const allergyIntoleranceCapability = "AllergyIntolerance";

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
    if (existingInsuranceprovider) {
      const res: AddHealthInsuranceProviderResponse = {
        insuranceProvider: existingInsuranceprovider,
      };
      return res;
    }

    const newProviderParams: InsuranceProvider = {
      userUid,
      accessToken,
      providerName: metadata.publisher,
      capabilities: metadata.capabilities,
    };

    // check if the health insurance provider already exists
    const newProvider = await insuranceRepo.addInsuranceProviderForPatient(
      newProviderParams
    );

    // need to make sure you're not adding duplicate
    // also maybe dont delete anything when removing the health insurance provider
    // this is also saving the claims data
    const claimsData = await getClaimsFromInsuranceProvider(newProvider);
    // now that you have the claims data
    // you want to sort out the meds
    const savedClaimsData = await insuranceRepo.batchWriteClaimsData(
      claimsData
    );

    console.log("CLAIMS DATA IS");
    console.log(claimsData);

    // and then add this as another medications field
    const derivedClaimsMedications = deriveClaimsMedications(
      savedClaimsData.medicationRequest,
      savedClaimsData.medicationDispense
    );

    console.log("DERIVED MEDS IS");
    console.log(derivedClaimsMedications);

    savedClaimsData.derivedClaimsMedications = derivedClaimsMedications;
    // let incomingFlexpaMedications =
    //   await flexpaGateway.getMedicationByAccessToken(accessToken);

    // incomingFlexpaMedications = fromFlexpaToEntityMedications(
    //   incomingFlexpaMedications,
    //   newProvider.uid
    // );

    // const incomingFlexpaMedicationResourceIds: string[] =
    //   incomingFlexpaMedications.map((med: Medication) => med.flexpaResourceId);

    // // get the ones that match
    // // retain the ones that dont
    // // get rid of anything we already have
    // const existingFlexpaMedications =
    //   await medicationsRepo.getMedicationsByFlepxaResourceIds(
    //     userUid,
    //     incomingFlexpaMedicationResourceIds
    //   );

    // const existingFlexpaMedicationsResourceIds = existingFlexpaMedications.map(
    //   (med) => med.flexpaResourceId
    // );

    // const incomingFlexpaMedicationsToBeInserted =
    //   incomingFlexpaMedications.filter(
    //     (med: Medication) =>
    //       !existingFlexpaMedicationsResourceIds.includes(med.flexpaResourceId)
    //   );

    // for (let i = 0; i < incomingFlexpaMedicationsToBeInserted.length; i++) {
    //   incomingFlexpaMedicationsToBeInserted[i].userUid = userUid;
    //   incomingFlexpaMedicationsToBeInserted[i].source = "CLAIMS";
    // }

    // // now make the request to medication dispense

    // // pull all meds for patient on the first of the month
    // const medications = await medicationsRepo.addMedicationsInbatch(
    //   incomingFlexpaMedicationsToBeInserted
    // );
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

interface MedContext {
  request: MedicationRequest[];
  dispense: MedicationDispense[];
}

// TODO - change the response to a new type and dont send med req/dispense
const deriveClaimsMedications = (
  medRequest: MedicationRequest[],
  medDispense: MedicationDispense[]
) => {
  const derivedMedications: DerivedMedication[] = [];
  const medicationMap = new Map<string, MedContext>();

  // group the medications by med request and med dispense
  for (let i = 0; i < medRequest.length; i++) {
    const medReq = medRequest[i];

    if (!medReq.code) continue;
    if (!medicationMap.has(medReq.code)) {
      const medContext: MedContext = {
        request: [],
        dispense: [],
      };
      medicationMap.set(medReq.code, medContext);
    }
    // if we have already pushed a med context for this med code,
    // then just query it and add the med request to that code
    medicationMap.get(medReq.code).request.push(medReq);
  }

  // do the same thing for medication dispensed.
  // it's possible we might have med dispensed that we dont have the requests for
  for (let i = 0; i < medDispense.length; i++) {
    const medDis = medDispense[i];

    if (!medDis.code) continue;
    if (!medicationMap.has(medDis.code)) {
      const medContext: MedContext = {
        request: [],
        dispense: [],
      };
      medicationMap.set(medDis.code, medContext);
    }
    medicationMap.get(medDis.code).dispense.push(medDis);
  }

  const medContextValues = Array.from(medicationMap.values());
  for (let i = 0; i < medContextValues.length; i++) {
    const medContext = medContextValues[i];
    // need to check this in nodejs compiler
    medContext.request = medContext.request.sort(
      (a: MedicationRequest, b: MedicationRequest) =>
        new Date(b.authoredOn).valueOf() - new Date(a.authoredOn).valueOf()
    );
    medContext.dispense = medContext.dispense.sort(
      (a: MedicationDispense, b: MedicationDispense) =>
        new Date(b.whenHandedOver).valueOf() -
        new Date(a.whenHandedOver).valueOf()
    );

    const derivedMedication: DerivedMedication = {};

    if (medContext?.dispense?.length > 0) {
      const lastRefill = medContext?.dispense?.[0]?.whenHandedOver;
      const firstRefill =
        medContext.dispense[medContext?.dispense?.length - 1].whenHandedOver;

      derivedMedication.firstFillOn = firstRefill;
      derivedMedication.lastFilledOn = lastRefill;
    }

    if (medContext?.request?.length > 0) {
      const lastRequested = medContext.request[0].authoredOn;
      derivedMedication.lastRequestedOn = lastRequested;
    }

    if (medContext?.request?.length > 0 || medContext?.dispense?.length > 0) {
      derivedMedications.push(derivedMedication);
    }
  }
  return derivedMedications;
};

// get all claims data from insurance provider
// this is after you've already checked to make sure you haven't seen this health insurance provider
export const getClaimsFromInsuranceProvider = async (
  insuranceProvider: InsuranceProvider
): Promise<ClaimsData> => {
  // TOOD – if it fails, you shouldn't add the insurance provdier
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

  const claimsResults = await Promise.allSettled(
    concurrentPromisesToExecute.map((fn) =>
      fn(insuranceProvider.accessToken, insuranceProvider.uid)
    )
  );

  // TODO – add in rest of the claims data here
  const claimsData: ClaimsData = {
    medicationRequest: [],
    allergyIntolerance: [],
    medicationDispense: [],
    immunization: [],
    condition: [],
    procedure: [],
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
  // const savedClaimsData = await insuranceRepo.batchWriteClaimsData(
  //   claimsDataToWrite
  // );

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

      const entityMedRequestList = fromFlexpaToEntityMedicationRequestList(
        flexpaMedRequest.entry,
        insuranceProviderUid
      );

      res({ type: MEDICATION_REQUEST, values: entityMedRequestList });
    } catch (e) {
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

      const entityMedDispenseList = fromFlexpaToEntityMedicationDispenseList(
        flexpaMedDispense.entry,
        insuranceProviderUid
      );

      res({ type: MEDICATION_DISPENSE, values: entityMedDispenseList });
    } catch (e) {
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
        fromFlexpaToEntityAllergyIntoleranceList(
          flexpaAllergyIntolerance.entry,
          insuranceProviderUid
        );

      // map it
      res({ type: ALLERGY_INTOLERANCE, values: allergyIntoleranceEntityList });
    } catch (e) {
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

      const conditionsEntityList = fromFlexpaToEntityConditionList(
        flexpaConditions,
        insuranceProviderUid
      );
      console.log("CONDITIONS ARE");
      console.log(conditionsEntityList);

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
        flexpaImmunizationList,
        insuranceProviderUid
      );
      console.log("IMMUNIZATIONS ARE");
      console.log(immunizationsEntityList);

      res({ type: IMMUNIZATION, values: immunizationsEntityList });
    } catch (e) {
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

      const proceduresEntityList = fromFlexpaToEntityProcedureList(
        flexpaProceduresList,
        insuranceProviderUid
      );
      console.log("PROCEDURES ARE");
      console.log(proceduresEntityList);

      res({ type: PROCEDURE, values: proceduresEntityList });
    } catch (e) {
      rej(e);
    }
  });
};
