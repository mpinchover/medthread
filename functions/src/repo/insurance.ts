import * as admin from "firebase-admin";
import {
  AllergyIntolerance,
  InsuranceProvider,
  MedicationDispense,
  MedicationRequest,
  ClaimsData,
  Procedure,
  Immunization,
  Condition,
  Encounter,
  Observation,
  CareTeam,
  PatientRecordsQueryFilter,
  ExplanationOfBenefit,
} from "../types";
import Database from "./database";
import * as constants from "../config/constants";

export const addInsuranceProviderForPatient = async (
  params: InsuranceProvider
) => {
  try {
    const db = await Database.getDb();
    const insuranceProviderRef = db.collection(
      constants.INSURANCE_PROVIDER_COLLECTION
    );
    await insuranceProviderRef.insertOne(params);
  } catch (e) {
    console.log(e);
  }
  return params;
};

export const updateAccessTokenForInsuranceProvider = async (
  uuid: string,
  accessToken: string
) => {
  const db = await Database.getDb();
  const insuranceProviderRef = db.collection(
    constants.INSURANCE_PROVIDER_COLLECTION
  );
  await insuranceProviderRef.updateOne({ uuid }, { accessToken });
  // // const db = admin.firestore();
  // const docRef = db.collection(insuranceProvidersCollection).doc(uid);
  // await docRef.update({ accessToken });
};

export const getInsuranceProvidersByUserUuid = async (
  userUuid: string
): Promise<null | InsuranceProvider[]> => {
  const db = await Database.getDb();
  const insuranceProviders: InsuranceProvider[] = [];
  const insuranceProviderRef = db.collection(
    constants.INSURANCE_PROVIDER_COLLECTION
  );

  const documents = await insuranceProviderRef.find({ userUuid });
  await documents.forEach((document: any) => {
    insuranceProviders.push(document);
  });
  return insuranceProviders;
};

export const getInsuranceProviderByUserUuidAndName = async (
  providerName: string,
  userUid: string
): Promise<null | InsuranceProvider> => {
  const db = await Database.getDb();

  const collection = db.collection(constants.INSURANCE_PROVIDER_COLLECTION);
  const provider: any = await collection.findOne({ providerName, userUid });
  return provider;
};

export const getHealthInsuranceProvidersByPatientUuid = async (
  userUuid: string
): Promise<InsuranceProvider[]> => {
  const db = await Database.getDb();
  // const db = admin.firestore();

  const providers: InsuranceProvider[] = [];
  const c = db.collection(constants.INSURANCE_PROVIDER_COLLECTION);
  const docs = await c.find({ userUuid });
  await docs.forEach((doc: any) => {
    providers.push(doc);
  });
  return providers;
};

export const batchWriteClaimsData = async (claimsDataToWrite: ClaimsData) => {
  try {
    const db = await Database.getDb();
    const client = await Database.getClient();

    const session = client.startSession();

    if (claimsDataToWrite.explanationOfBenefit.length > 0) {
      await db
        .collection(constants.EXPLANATION_OF_BENEFIT_COLLECTION)
        .insertMany(claimsDataToWrite.explanationOfBenefit);
    }

    if (claimsDataToWrite.medicationRequest.length > 0) {
      await db
        .collection(constants.MEDICATION_REQUEST_COLLECTION)
        .insertMany(claimsDataToWrite.medicationRequest);
    }

    if (claimsDataToWrite.medicationDispense.length > 0) {
      await db
        .collection(constants.MEDICATION_DISPENSE_COLLECTION)
        .insertMany(claimsDataToWrite.medicationDispense);
    }

    if (claimsDataToWrite.allergyIntolerance.length > 0) {
      await db
        .collection(constants.ALLERGY_INTOLERANCE_COLLECTION)
        .insertMany(claimsDataToWrite.allergyIntolerance);
    }

    if (claimsDataToWrite.immunization.length > 0) {
      await db
        .collection(constants.IMMUNIZATION_COLLECTION)
        .insertMany(claimsDataToWrite.immunization);
    }

    if (claimsDataToWrite.condition.length > 0) {
      await db
        .collection(constants.CONDITION_COLLECTION)
        .insertMany(claimsDataToWrite.condition);
    }

    if (claimsDataToWrite.procedure.length > 0) {
      await db
        .collection(constants.PROCEDURE_COLLECTION)
        .insertMany(claimsDataToWrite.procedure);
    }

    if (claimsDataToWrite.encounter.length > 0) {
      await db
        .collection(constants.ENCOUNTER_COLLECTION)
        .insertMany(claimsDataToWrite.encounter);
    }

    if (claimsDataToWrite.observation.length > 0) {
      await db
        .collection(constants.OBSERVATION_COLLECTION)
        .insertMany(claimsDataToWrite.observation);
    }

    if (claimsDataToWrite.careTeam.length > 0) {
      await db
        .collection(constants.CARE_TEAM_COLLECTION)
        .insertMany(claimsDataToWrite.careTeam);
    }

    await session.endSession();
  } catch (e) {
    console.log(e);
  }
};

export const batchWriteMedicationRequest = async (
  params: MedicationRequest[]
) => {
  if (params.length === 0) return;
  const db = await Database.getDb();
  const c = db.collection(constants.MEDICATION_REQUEST_COLLECTION);

  await c.insertMany(params);
};

export const batchWriteAllergyIntolerances = async (
  params: AllergyIntolerance[]
) => {
  if (params.length === 0) return;
  const db = await Database.getDb();
  const c = db.collection(constants.ALLERGY_INTOLERANCE_COLLECTION);
  await c.insertMany(params);
};

export const getExplanationOfBenefitByUserUuid = async (
  filter: PatientRecordsQueryFilter
): Promise<ExplanationOfBenefit[]> => {
  const db = await Database.getDb();

  const c = db.collection(constants.EXPLANATION_OF_BENEFIT_COLLECTION);
  const eobs: ExplanationOfBenefit[] = [];

  const query: any = { userUuid: filter.userUuid };
  // if (filter.encounterTypes?.length > 0) {
  //   query.type = { $in: filter.encounterTypes };
  // }

  const docs = await c.find(query);

  // console.log("DOCS");
  // console.log(docs);
  await docs.forEach((doc: any) => {
    const document: ExplanationOfBenefit = doc;
    eobs.push(document);
  });

  // console.log("DOCS ARE");

  return eobs;
};

export const getClaimsMedicationRequestByUserUuid = async (
  filter: PatientRecordsQueryFilter
): Promise<MedicationRequest[]> => {
  const db = await Database.getDb();

  const medicationRequests: MedicationRequest[] = [];
  const docs = await db
    .collection(constants.MEDICATION_REQUEST_COLLECTION)
    .find({ userUuid: filter.userUuid });
  await docs.forEach((doc: any) => {
    medicationRequests.push(doc);
  });
  return medicationRequests;
};

export const getClaimsMedicationDispenseByUserUuid = async (
  filter: PatientRecordsQueryFilter
): Promise<MedicationDispense[]> => {
  const db = await Database.getDb();
  const medicationDispense: MedicationDispense[] = [];

  const docs = await db
    .collection(constants.MEDICATION_DISPENSE_COLLECTION)
    .find({ userUuid: filter.userUuid });

  await docs.forEach((doc: any) => {
    medicationDispense.push(doc);
  });
  return medicationDispense;
};

export const getClaimsProcedureByUserUuid = async (
  filter: PatientRecordsQueryFilter
): Promise<Procedure[]> => {
  const db = await Database.getDb();
  const procedures: Procedure[] = [];

  const docs = await db
    .collection(constants.PROCEDURE_COLLECTION)
    .find({ userUuid: filter.userUuid });

  await docs.forEach((doc: any) => {
    procedures.push(doc);
  });
  return procedures;
};

export const getClaimsEncounterByUserUuid = async (
  filter: PatientRecordsQueryFilter
): Promise<Encounter[]> => {
  const db = await Database.getDb();
  const encounters: Encounter[] = [];

  const query: any = { userUuid: filter.userUuid };
  if (filter.encounterTypes?.length > 0) {
    query.code = { $in: filter.encounter };
  }
  const docs = await db.collection(constants.ENCOUNTER_COLLECTION).find(query);
  await docs.forEach((doc: any) => {
    encounters.push(doc);
  });

  return encounters;
};

export const getClaimsConditionByUserUuid = async (
  filter: PatientRecordsQueryFilter
): Promise<Condition[]> => {
  const db = await Database.getDb();
  const conditions: Condition[] = [];

  const query = {
    userUuid: filter.userUuid,
  };
  const docs = await db.collection(constants.CONDITION_COLLECTION).find(query);
  await docs.forEach((doc: any) => {
    conditions.push(doc);
  });

  return conditions;
};

export const getClaimsAllergyIntoleranceByUserUuid = async (
  filter: PatientRecordsQueryFilter
): Promise<AllergyIntolerance[]> => {
  const db = await Database.getDb();
  const allergyIntolerance: AllergyIntolerance[] = [];

  const query = {
    userUuid: filter.userUuid,
  };

  const docs = await db
    .collection(constants.ALLERGY_INTOLERANCE_COLLECTION)
    .find(query);
  await docs.forEach((doc: any) => {
    allergyIntolerance.push(doc);
  });

  return allergyIntolerance;
};

export const getProceduresByFhirReferencesInBatch = async (
  references: string[]
) => {
  if (references.length === 0) return [];

  const batchSize = 10;
  const refs = references.slice();
  const batches: string[][] = [];

  while (refs.length > 0) {
    const batch = refs.splice(0, batchSize);
    batches.push(batch);
  }

  const promiseResults: any = await Promise.allSettled(
    batches.map((batch) => {
      return getProceduresByFhirReferences(batch);
    })
  );

  const procedures: Procedure[] = [];
  for (let i = 0; i < promiseResults.length; i++) {
    if (promiseResults[i].status === "rejected") continue;

    const procedure: Procedure = promiseResults[i].value;
    procedures.push(procedure);
  }

  return procedures;
};

export const getProceduresByFhirReferences = async (references: string[]) => {
  return new Promise(async (res, rej) => {
    try {
      if (references.length === 0) return res([]);

      const db = await Database.getDb();
      const procedures: Procedure[] = [];

      const query = {
        fhirReference: { $in: references },
      };

      const docs = await db
        .collection(constants.PROCEDURE_COLLECTION)
        .find(query);
      await docs.forEach((doc: any) => {
        procedures.push(doc);
      });

      res(procedures);
    } catch (e) {
      console.log(e);
      rej(e);
    }
  });
};

export const getClaimsImmunizationByUserUuid = async (
  filter: PatientRecordsQueryFilter
): Promise<Immunization[]> => {
  const db = await Database.getDb();
  const immunizations: Immunization[] = [];

  const query = {
    userUuid: filter.userUuid,
  };

  const docs = await db
    .collection(constants.IMMUNIZATION_COLLECTION)
    .find(query);
  await docs.forEach((doc: any) => {
    immunizations.push(doc);
  });

  return immunizations;
};
