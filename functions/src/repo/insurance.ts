import * as admin from "firebase-admin";
import {
  fromEntityToRepoAllergyIntoleranceList,
  fromEntityToRepoCareTeamList,
  fromEntityToRepoConditionList,
  fromEntityToRepoEncounterList,
  fromEntityToRepoExplanationOfBenefit,
  fromEntityToRepoExplanationOfBenefitList,
  fromEntityToRepoImmunization,
  fromEntityToRepoImmunizationList,
  fromEntityToRepoMedicationDispenseList,
  fromEntityToRepoMedicationRequestList,
  fromEntityToRepoObservationList,
  fromEntityToRepoProcedureList,
} from "../mappers/entity-to-repo";
import {
  fromRepoToEntityAllergyIntoleranceList,
  fromRepoToEntityCareTeamList,
  fromRepoToEntityConditionList,
  fromRepoToEntityEncounterList,
  fromRepoToEntityExplanationOfBenefitList,
  fromRepoToEntityImmunizationList,
  fromRepoToEntityMedicationRequestList,
  fromRepoToEntityObservationList,
  fromRepoToEntityProcedureList,
} from "../mappers/repo-to-entity";
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
} from "../types/types";
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
  insuranceProviderName: string, // i tthink is uuid for now?
  userUuid: string
): Promise<null | InsuranceProvider> => {
  const conn = await Database.getDb();

  const query = `select * from ${insuranceProvidersTable} where providerName = ? and userUuid = ?`;
  const params: any[] = [insuranceProviderName, userUuid];

  const [rows] = await conn.query<any>(query, params);
  if (rows?.length === 0) return null;
  return rows[0];
};

export const batchWriteClaimsData = async (
  claimsDataToWrite: ClaimsData
): Promise<ClaimsData> => {
  try {
    const conn = await Database.getDb();

    await conn.beginTransaction();

    let query;
    let params;
    if (claimsDataToWrite.explanationOfBenefit?.length > 0) {
      const r = fromEntityToRepoExplanationOfBenefitList(
        claimsDataToWrite.explanationOfBenefit
      );

      await r?.forEach(async (doc) => {
        query = `insert into ${explanationOfBenefitTable} set ?`;
        params = [doc];
        conn.query(query, params);
      });
    }

    if (claimsDataToWrite.medicationRequest?.length > 0) {
      const r = fromEntityToRepoMedicationRequestList(
        claimsDataToWrite.medicationRequest
      );

      await r?.forEach(async (doc) => {
        query = `insert into ${medicationRequestTable} set ?`;
        params = [doc];
        conn.query(query, params);
      });
    }

    if (claimsDataToWrite?.allergyIntolerance.length > 0) {
      const r = fromEntityToRepoAllergyIntoleranceList(
        claimsDataToWrite.allergyIntolerance
      );

      await r?.forEach(async (doc) => {
        query = `insert into ${allergyIntoleranceTable} set ?`;
        params = [doc];
        conn.query(query, params);
      });
    }

    if (claimsDataToWrite?.medicationDispense.length > 0) {
      const r = fromEntityToRepoMedicationDispenseList(
        claimsDataToWrite.medicationDispense
      );

      await r?.forEach(async (doc) => {
        query = `insert into ${medicationDispenseTable} set ?`;
        params = [doc];
        conn.query(query, params);
      });
    }

    if (claimsDataToWrite?.procedure.length > 0) {
      const r = fromEntityToRepoProcedureList(claimsDataToWrite.procedure);

      await r?.forEach(async (doc) => {
        query = `insert into ${procedureTable} set ?`;
        params = [doc];
        conn.query(query, params);
      });
    }

    if (claimsDataToWrite?.immunization.length > 0) {
      const r = fromEntityToRepoImmunizationList(
        claimsDataToWrite.immunization
      );
      await r?.forEach(async (doc) => {
        query = `insert into ${immunizationTable} set ?`;
        params = [doc];
        conn.query(query, params);
      });
    }

    if (claimsDataToWrite?.condition.length > 0) {
      const r = fromEntityToRepoConditionList(claimsDataToWrite.condition);

      await r?.forEach(async (doc) => {
        query = `insert into ${conditionTable} set ?`;
        params = [doc];
        conn.query(query, params);
      });
    }

    if (claimsDataToWrite?.encounter.length > 0) {
      const r = fromEntityToRepoEncounterList(claimsDataToWrite.encounter);
      await r?.forEach(async (doc) => {
        query = `insert into ${encounterTable} set ?`;
        params = [doc];
        conn.query(query, params);
      });
    }

    if (claimsDataToWrite?.observation.length > 0) {
      const r = fromEntityToRepoObservationList(claimsDataToWrite.observation);
      await r?.forEach(async (doc) => {
        query = `insert into ${observationTable} set ?`;
        params = [doc];
        conn.query(query, params);
      });
    }

    if (claimsDataToWrite?.careTeam.length > 0) {
      const r = fromEntityToRepoCareTeamList(claimsDataToWrite.careTeam);
      await r?.forEach(async (doc) => {
        query = `insert into ${careTeamTable} set ?`;
        params = [doc];
        conn.query(query, params);
      });
    }

    await conn.commit();
    return claimsDataToWrite;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const batchWriteMedicationRequest = async (
  medicationReqs: MedicationRequest[]
) => {
  if (medicationReqs?.length === 0) return medicationReqs;

  const conn = await Database.getDb();
  await conn.beginTransaction();

  const r = fromEntityToRepoMedicationRequestList(medicationReqs);

  await r.forEach(async (item) => {
    const query = `insert into ${medicationRequestTable} set ?`;
    const params: any[] = [item];
    await conn.query<any>(query, params);
  });

  await conn.commit();
  return medicationReqs;
};

export const batchWriteAllergyIntolerances = async (
  allergyIntolerances: AllergyIntolerance[]
) => {
  if (allergyIntolerances.length === 0) return allergyIntolerances;

  const r = fromEntityToRepoAllergyIntoleranceList(allergyIntolerances);

  const conn = await Database.getDb();
  await conn.beginTransaction();

  await r.forEach(async (item) => {
    const params: any[] = [item];
    const query = conn.format(
      `insert into ${allergyIntoleranceTable} set ?`,
      params
    );
    await conn.query<any>(query, params);
  });

  await conn.commit();
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
  const eobs = await getClaimsItemByUserUuid(
    explanationOfBenefitTable,
    filter.userUuid
  );
  return fromRepoToEntityExplanationOfBenefitList(eobs);
};

export const getClaimsMedicationRequestByUserUuid = async (
  filter: PatientRecordsQueryFilter
): Promise<MedicationRequest[]> => {
  const medReq = await getClaimsItemByUserUuid(
    medicationRequestTable,
    filter.userUuid
  );
  return fromRepoToEntityMedicationRequestList(medReq);
};

export const getClaimsMedicationDispenseByUserUuid = async (
  filter: PatientRecordsQueryFilter
): Promise<MedicationDispense[]> => {
  const medDis = await getClaimsItemByUserUuid(
    medicationDispenseTable,
    filter.userUuid
  );
  return fromEntityToRepoMedicationDispenseList(medDis);
};

export const getClaimsProcedureByUserUuid = async (
  filter: PatientRecordsQueryFilter
): Promise<Procedure[]> => {
  const procedures = await getClaimsItemByUserUuid(
    procedureTable,
    filter.userUuid
  );
  return fromRepoToEntityProcedureList(procedures);
};

export const getClaimsEncounterByUserUuid = async (
  filter: PatientRecordsQueryFilter
): Promise<Encounter[]> => {
  const encounters = await getClaimsItemByUserUuid(
    encounterTable,
    filter.userUuid
  );
  return fromRepoToEntityEncounterList(encounters);
};

export const getClaimsConditionByUserUuid = async (
  filter: PatientRecordsQueryFilter
): Promise<Condition[]> => {
  const conditions = await getClaimsItemByUserUuid(
    conditionTable,
    filter.userUuid
  );
  return fromRepoToEntityConditionList(conditions);
};

export const getClaimsAllergyIntoleranceByUserUuid = async (
  filter: PatientRecordsQueryFilter
): Promise<AllergyIntolerance[]> => {
  const allergyIntolerance = await getClaimsItemByUserUuid(
    allergyIntoleranceTable,
    filter.userUuid
  );

  return fromRepoToEntityAllergyIntoleranceList(allergyIntolerance);
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

    const procedure = promiseResults[i].value;
    procedures.push(procedure);
  }

  return fromRepoToEntityProcedureList(procedures);
};

export const getProceduresByFhirReferences = async (references: string[]) => {
  return new Promise(async (res, rej) => {
    try {
      if (references.length === 0) return res([]);

      const conn = await Database.getDb();

      const query = `select * from ${procedureTable} where fhirReference in (?)`;
      const params: any[] = [references];
      const [rows] = await conn.query<any>(query, params);
      const items: any[] = [];

      for (const record of rows) {
        items.push(record);
      }
      // return items;
      res(items);
    } catch (e) {
      console.log(e);
      rej(e);
    }
  });
};

export const getClaimsImmunizationByUserUuid = async (
  filter: PatientRecordsQueryFilter
): Promise<Immunization[]> => {
  const immunizations = await getClaimsItemByUserUuid(
    immunizationTable,
    filter.userUuid
  );
  return fromRepoToEntityImmunizationList(immunizations);
};

export const getClaimsObservationByUserUuid = async (
  filter: PatientRecordsQueryFilter
): Promise<Observation[]> => {
  const results = await getClaimsItemByUserUuid(
    observationTable,
    filter.userUuid
  );
  return fromRepoToEntityObservationList(results);
};

export const getClaimsCareTeamByUserUuid = async (
  filter: PatientRecordsQueryFilter
): Promise<CareTeam[]> => {
  const results = await getClaimsItemByUserUuid(careTeamTable, filter.userUuid);
  return fromRepoToEntityCareTeamList(results);
};
