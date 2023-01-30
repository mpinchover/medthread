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
const medicationRequestCollection = "medicationRequest";
const allergyIntoleranceCollection = "allergyIntolerance";
const medicationDispenseCollection = "medicationDispense";
const procedureCollection = "procedure";
const immunizationCollection = "immunization";
const conditionCollection = "condition";
const insuranceProvidersCollection = "insuranceProviders";
const encounterCollection = "encounters";
const careTeamCollection = "careTeams";
const observationCollection = "observations";
const explanationOfBenefitCollection = "explanationOfBenefit";

export const addInsuranceProviderForPatient = async (
  params: InsuranceProvider
) => {
  try {
    const db = admin.firestore();
    const insuranceProviderDocRef = db
      .collection(insuranceProvidersCollection)
      .doc();
    params.uid = insuranceProviderDocRef.id;
    await insuranceProviderDocRef.set(params);
  } catch (e) {
    console.log(e);
  }
  return params;
};

export const updateAccessTokenForInsuranceProvider = async (
  uid: string,
  accessToken: string
) => {
  const db = admin.firestore();
  const docRef = db.collection(insuranceProvidersCollection).doc(uid);
  await docRef.update({ accessToken });
};

export const getInsuranceProvidersByUserUid = async (
  userUid: string
): Promise<null | InsuranceProvider[]> => {
  const db = admin.firestore();
  const insuranceProvidersRef = db.collection(insuranceProvidersCollection);
  const snapshot = await insuranceProvidersRef
    .where("userUid", "==", userUid)
    .get();

  if (snapshot.empty) return [];
  return snapshot.docs.map((doc) => {
    const data: any = doc.data();
    const uid = doc.id;
    return {
      ...data,
      uid,
    };
  });
};

export const removeHealthInsuranceProvider = async (
  insuranceProviderUid: string
) => {
  const db = admin.firestore();
  const insuranceProvidersRef = db.collection(insuranceProvidersCollection);
  await insuranceProvidersRef.doc(insuranceProviderUid).delete();
};

export const getInsuranceProviderByUserUidAndName = async (
  providerName: string,
  userUid: string
): Promise<null | InsuranceProvider> => {
  const db = admin.firestore();
  const insuranceProvidersRef = db.collection(insuranceProvidersCollection);
  const snapshot = await insuranceProvidersRef
    .where("providerName", "==", providerName)
    .where("userUid", "==", userUid)
    .get();

  if (snapshot.empty) return null;

  const data: any = snapshot.docs[0].data();
  const uid = snapshot.docs[0].id;

  const res: InsuranceProvider = {
    ...data,
    uid,
  };
  return res;
};

export const getHealthInsuranceProvidersByPatientUid = async (
  userUid: string
): Promise<InsuranceProvider[]> => {
  const db = admin.firestore();
  const insuranceProvidersRef = db.collection(insuranceProvidersCollection);
  const snapshot = await insuranceProvidersRef
    .where("userUid", "==", userUid)
    .get();

  if (snapshot.empty) return [];

  const res: InsuranceProvider[] = snapshot.docs.map((doc) => {
    const data: any = doc.data();
    return {
      ...data,
      uid: doc.id,
    };
  });

  return res;
};

export const batchWriteClaimsData = async (
  claimsDataToWrite: ClaimsData
): Promise<ClaimsData> => {
  try {
    const db = admin.firestore();
    const batch = db.batch();

    for (let i = 0; i < claimsDataToWrite.explanationOfBenefit.length; i++) {
      const doc: ExplanationOfBenefit =
        claimsDataToWrite.explanationOfBenefit[i];
      const docRef = db.collection(explanationOfBenefitCollection).doc();
      doc.uid = docRef.id;
      batch.set(docRef, doc);
      claimsDataToWrite.explanationOfBenefit[i] = doc;
    }

    for (let i = 0; i < claimsDataToWrite.medicationRequest.length; i++) {
      const doc: MedicationRequest = claimsDataToWrite.medicationRequest[i];
      const docRef = db.collection(medicationRequestCollection).doc();
      doc.uid = docRef.id;
      batch.set(docRef, doc);
      claimsDataToWrite.medicationRequest[i] = doc;
    }

    for (let i = 0; i < claimsDataToWrite.allergyIntolerance.length; i++) {
      const doc: AllergyIntolerance = claimsDataToWrite.allergyIntolerance[i];
      const docRef = db.collection(allergyIntoleranceCollection).doc();
      doc.uid = docRef.id;
      batch.set(docRef, doc);
      claimsDataToWrite.allergyIntolerance[i] = doc;
    }

    for (let i = 0; i < claimsDataToWrite.medicationDispense.length; i++) {
      const doc: MedicationDispense = claimsDataToWrite.medicationDispense[i];
      const docRef = db.collection(medicationDispenseCollection).doc();
      doc.uid = docRef.id;
      batch.set(docRef, doc);
      claimsDataToWrite.medicationDispense[i] = doc;
    }

    for (let i = 0; i < claimsDataToWrite.procedure.length; i++) {
      const doc: Procedure = claimsDataToWrite.procedure[i];
      const docRef = db.collection(procedureCollection).doc();
      doc.uid = docRef.id;
      batch.set(docRef, doc);
      claimsDataToWrite.condition[i] = doc;
    }

    for (let i = 0; i < claimsDataToWrite.immunization.length; i++) {
      const doc: Immunization = claimsDataToWrite.immunization[i];
      const docRef = db.collection(immunizationCollection).doc();
      doc.uid = docRef.id;
      batch.set(docRef, doc);
      claimsDataToWrite.immunization[i] = doc;
    }

    for (let i = 0; i < claimsDataToWrite.condition.length; i++) {
      const doc: Condition = claimsDataToWrite.condition[i];
      const docRef = db.collection(conditionCollection).doc();
      doc.uid = docRef.id;
      batch.set(docRef, doc);
      claimsDataToWrite.condition[i] = doc;
    }

    for (let i = 0; i < claimsDataToWrite.encounter.length; i++) {
      const doc: Encounter = claimsDataToWrite.encounter[i];
      const docRef = db.collection(encounterCollection).doc();
      doc.uid = docRef.id;
      batch.set(docRef, doc);
      claimsDataToWrite.encounter[i] = doc;
    }

    for (let i = 0; i < claimsDataToWrite.observation.length; i++) {
      const doc: Observation = claimsDataToWrite.observation[i];
      const docRef = db.collection(observationCollection).doc();
      doc.uid = docRef.id;
      batch.set(docRef, doc);
      claimsDataToWrite.observation[i] = doc;
    }

    for (let i = 0; i < claimsDataToWrite.careTeam.length; i++) {
      const doc: CareTeam = claimsDataToWrite.careTeam[i];
      const docRef = db.collection(careTeamCollection).doc();
      doc.uid = docRef.id;
      batch.set(docRef, doc);
      claimsDataToWrite.careTeam[i] = doc;
    }

    await batch.commit();
    return claimsDataToWrite;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const batchWriteMedicationRequest = async (
  params: MedicationRequest[]
) => {
  const db = admin.firestore();
  const batch = db.batch();

  for (let i = 0; i < params.length; i++) {
    const doc: MedicationRequest = params[i];
    const docRef = db.collection(medicationRequestCollection).doc();

    doc.uid = docRef.id;
    batch.set(docRef, doc);
    params[i] = doc;
  }
  await batch.commit();
  return params;
};

export const batchWriteAllergyIntolerances = async (
  params: AllergyIntolerance[]
) => {
  const db = admin.firestore();
  const batch = db.batch();

  for (let i = 0; i < params.length; i++) {
    const doc: AllergyIntolerance = params[i];
    const docRef = db.collection(allergyIntoleranceCollection).doc();

    doc.uid = docRef.id;
    batch.set(docRef, doc);
    params[i] = doc;
  }
  await batch.commit();
  return params;
};

export const getExplanationOfBenefitByUserUid = async (
  filter: PatientRecordsQueryFilter
): Promise<ExplanationOfBenefit[]> => {
  const db = admin.firestore();

  const explanationOfBenefit = db.collection(explanationOfBenefitCollection);
  let query = explanationOfBenefit.where("userUid", "==", filter.userUid);

  if (filter.encounterTypes?.length > 0) {
    query = query.where("types", "array-contains-any", filter.encounterTypes);
  }

  const snapshot = await query.get();

  if (snapshot.empty) return [];

  const res: ExplanationOfBenefit[] = snapshot.docs.map((doc) => doc.data());

  return res;
};

export const getClaimsMedicationRequestByUserUid = async (
  filter: PatientRecordsQueryFilter
): Promise<MedicationRequest[]> => {
  const db = admin.firestore();

  const medicationsReqRef = db.collection(medicationRequestCollection);
  const snapshot = await medicationsReqRef
    .where("userUid", "==", filter.userUid)
    .get();

  if (snapshot.empty) return [];

  const res: MedicationRequest[] = snapshot.docs.map((doc) => {
    const data: any = doc.data();
    return {
      ...data,
      uid: doc.id,
    };
  });
  return res;
};

export const getClaimsMedicationDispenseByUserUid = async (
  filter: PatientRecordsQueryFilter
): Promise<MedicationDispense[]> => {
  const db = admin.firestore();

  const medicationsDisRef = db.collection(medicationDispenseCollection);
  const snapshot = await medicationsDisRef
    .where("userUid", "==", filter.userUid)
    .get();

  if (snapshot.empty) return [];

  const res: MedicationDispense[] = snapshot.docs.map((doc) => {
    const data: any = doc.data();
    return {
      ...data,
      uid: doc.id,
    };
  });
  return res;
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
