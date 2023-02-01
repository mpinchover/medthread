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
import Database from "./mysql";
const medicationRequestTable = "claimsMedicationRequest";
const allergyIntoleranceTable = "claimsAllergyTolerance";
const medicationDispenseTable = "claimsMedicationDispense";
const procedureTable = "claimsProcedure";
const immunizationTable = "claimsImmunization";
const conditionTable = "claimsCondition";
const insuranceProvidersTable = "insuranceProviders";
const encounterTable = "claimsEncounter";
const careTeamTable = "claimsCareTeam";
const observationTable = "claimsObesrvation";
const explanationOfBenefitTable = "claimsExplanationOfBenefit";

export const addInsuranceProviderForPatient = async (
  insuranceProvider: InsuranceProvider
) => {
  try {
    const conn = await Database.getDb();
    const query = `insert into ${insuranceProvidersTable} set ?`;
    const params: any[] = [insuranceProvider];

    await conn.query<any>(query, params);
  } catch (e) {
    console.log(e);
  }
  return insuranceProvider;
};

// export const updateAccessTokenForInsuranceProvider = async (
//   uid: string,
//   accessToken: string
// ) => {
//   const db = admin.firestore();
//   const docRef = db.collection(insuranceProvidersCollection).doc(uid);
//   await docRef.update({ accessToken });
// };

export const getInsuranceProvidersByUserUuid = async (
  userUuid: string
): Promise<null | InsuranceProvider[]> => {
  const conn = await Database.getDb();
  const query = `select * from ${insuranceProvidersTable} where userUuid = ?`;
  const params: any[] = [userUuid];

  const [rows] = await conn.query<any>(query, params);
  if (rows?.length === 0) return [];

  const providers: InsuranceProvider[] = [];
  for (const record of rows) {
    providers.push(record);
  }
  return providers;
};

// export const removeHealthInsuranceProvider = async (
//   insuranceProviderUid: string
// ) => {
//   const db = admin.firestore();
//   const insuranceProvidersRef = db.collection(insuranceProvidersCollection);
//   await insuranceProvidersRef.doc(insuranceProviderUid).delete();
// };

export const getInsuranceProviderByUserUuidAndName = async (
  providerUuid: string, // i tthink is uuid for now?
  userUuid: string
): Promise<null | InsuranceProvider> => {
  const conn = await Database.getDb();

  const query = `select * from ${insuranceProvidersTable} where providerUuid = ? and userUuid = ?`;
  const params: any[] = [providerUuid, userUuid];

  const [rows] = await conn.query<any>(query, params);
  if (rows?.length === 0) return null;
  return rows[0];
};

export const batchWriteClaimsData = async (
  claimsDataToWrite: ClaimsData
): Promise<ClaimsData> => {
  try {
    const conn = await Database.getDb();

    await conn.query("START TRANSACTION");

    let query = `insert into ${explanationOfBenefitTable} set ?`;
    let params: any[] = [claimsDataToWrite.explanationOfBenefit];
    await conn.query(query, params);

    query = `insert into ${medicationRequestTable} set ?`;
    params = [claimsDataToWrite.medicationRequest];
    await conn.query(query, params);

    query = `insert into ${allergyIntoleranceTable} set ?`;
    params = [claimsDataToWrite.allergyIntolerance];
    await conn.query(query, params);

    query = `insert into ${medicationDispenseTable} set ?`;
    params = [claimsDataToWrite.medicationDispense];
    await conn.query(query, params);

    query = `insert into ${procedureTable} set ?`;
    params = [claimsDataToWrite.procedure];
    await conn.query(query, params);

    query = `insert into ${immunizationTable} set ?`;
    params = [claimsDataToWrite.immunization];
    await conn.query(query, params);

    query = `insert into ${conditionTable} set ?`;
    params = [claimsDataToWrite.condition];
    await conn.query(query, params);

    query = `insert into ${encounterTable} set ?`;
    params = [claimsDataToWrite.encounter];
    await conn.query(query, params);

    query = `insert into ${observationTable} set ?`;
    params = [claimsDataToWrite.observation];
    await conn.query(query, params);

    query = `insert into ${careTeamTable} set ?`;
    params = [claimsDataToWrite.careTeam];
    await conn.query(query, params);

    await conn.query("COMMIT");
    return claimsDataToWrite;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const batchWriteMedicationRequest = async (
  medicationReqs: MedicationRequest[]
) => {
  const conn = await Database.getDb();

  const query = `select * from ${medicationRequestTable} where careProviderUuid = ?`;
  const params: any[] = [medicationReqs];

  await conn.query<any>(query, params);
  return medicationReqs;
};

export const batchWriteAllergyIntolerances = async (
  allergyIntolerances: AllergyIntolerance[]
) => {
  const conn = await Database.getDb();

  const query = `select * from ${allergyIntoleranceTable} where careProviderUuid = ?`;
  const params: any[] = [allergyIntolerances];

  await conn.query<any>(query, params);
  return allergyIntolerances;
};

export const getClaimsItemByUserUuid = async (
  table: string,
  userUuid: string
) => {
  const conn = await Database.getDb();

  const query = `select * from ${table} where userUuid = ?`;
  const params: any[] = [userUuid];
  const [rows] = await conn.query<any>(query, params);
  const items: any[] = [];

  for (const record of rows) {
    items.push(record);
  }
  return items;
};

export const getExplanationOfBenefitByUserUuid = async (
  filter: PatientRecordsQueryFilter
): Promise<ExplanationOfBenefit[]> => {
  const eobs: ExplanationOfBenefit[] = await getClaimsItemByUserUuid(
    explanationOfBenefitTable,
    filter.userUuid
  );
  return eobs;
};

export const getClaimsMedicationRequestByUserUid = async (
  filter: PatientRecordsQueryFilter
): Promise<MedicationRequest[]> => {
  const medReq: MedicationRequest[] = await getClaimsItemByUserUuid(
    medicationRequestTable,
    filter.userUuid
  );
  return medReq;
};

export const getClaimsMedicationDispenseByUserUid = async (
  filter: PatientRecordsQueryFilter
): Promise<MedicationDispense[]> => {
  const medDis: MedicationDispense[] = await getClaimsItemByUserUuid(
    medicationDispenseTable,
    filter.userUuid
  );
  return medDis;
};

export const getClaimsProcedureByUserUid = async (
  filter: PatientRecordsQueryFilter
): Promise<Procedure[]> => {
  const db = admin.firestore();

  const procedureRef = db.collection(procedureCollection);
  const snapshot = await procedureRef
    .where("userUid", "==", filter.userUid)
    .get();

  if (snapshot.empty) return [];

  const res: Procedure[] = snapshot.docs.map((doc) => {
    const data: any = doc.data();
    return {
      ...data,
      uid: doc.id,
    };
  });
  return res;
};

export const getClaimsEncounterByUserUid = async (
  filter: PatientRecordsQueryFilter
): Promise<Procedure[]> => {
  const db = admin.firestore();

  const encounterRef = db.collection(encounterCollection);

  let query = encounterRef.where("userUid", "==", filter.userUid);
  if (filter.encounterTypes?.length > 0) {
    query = query.where("code", "in", filter.encounterTypes);
  }
  const snapshot = await query.get();

  if (snapshot.empty) return [];

  const res: Encounter[] = snapshot.docs.map((doc) => {
    const data: any = doc.data();
    return {
      ...data,
      uid: doc.id,
    };
  });
  return res;
};

export const getClaimsConditionByUserUid = async (
  filter: PatientRecordsQueryFilter
): Promise<Condition[]> => {
  const db = admin.firestore();

  const conditionRef = db.collection(conditionCollection);
  const snapshot = await conditionRef
    .where("userUid", "==", filter.userUid)
    .get();

  if (snapshot.empty) return [];

  const res: Condition[] = snapshot.docs.map((doc) => {
    const data: any = doc.data();
    return {
      ...data,
      uid: doc.id,
    };
  });
  return res;
};

export const getClaimsAllergyIntoleranceByUserUid = async (
  filter: PatientRecordsQueryFilter
): Promise<AllergyIntolerance[]> => {
  const db = admin.firestore();

  const allergyIntoleranceRef = db.collection(allergyIntoleranceCollection);
  const snapshot = await allergyIntoleranceRef
    .where("userUid", "==", filter.userUid)
    .get();

  if (snapshot.empty) return [];

  const res: AllergyIntolerance[] = snapshot.docs.map((doc) => {
    const data: any = doc.data();
    return {
      ...data,
      uid: doc.id,
    };
  });
  return res;
};

// need make this in batches
// https://stackoverflow.com/questions/61354866/is-there-a-workaround-for-the-firebase-query-in-limit-to-10
// export const getProceduresByFhirReference = async (references: string[]) => {
//   if (references.length === 0) return [];
//   const db = admin.firestore();

//   const proceduresRef = db.collection(procedureCollection);
//   const snapshot = await proceduresRef
//     .where("fhirReference", "in", references)
//     .get();

//   if (snapshot.empty) return [];

//   const res: Procedure[] = snapshot.docs.map((doc) => doc.data());
//   return res;
// };

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
      const db = admin.firestore();

      const proceduresRef = db.collection(procedureCollection);
      const snapshot = await proceduresRef
        .where("fhirReference", "in", references)
        .get();

      if (snapshot.empty) res([]);

      const result: Procedure[] = snapshot.docs.map((doc) => doc.data());
      res(result);
    } catch (e) {
      console.log(e);
      rej(e);
    }
  });
};

export const getClaimsImmunizationByUserUid = async (
  filter: PatientRecordsQueryFilter
): Promise<Immunization[]> => {
  const db = admin.firestore();

  const immunizationRef = db.collection(immunizationCollection);
  const snapshot = await immunizationRef
    .where("userUid", "==", filter.userUid)
    .get();

  if (snapshot.empty) return [];

  const res: Immunization[] = snapshot.docs.map((doc) => {
    const data: any = doc.data();
    return {
      ...data,
      uid: doc.id,
    };
  });
  return res;
};
