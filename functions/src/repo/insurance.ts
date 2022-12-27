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
} from "../types";
const medicationRequestCollection = "medicationRequest";
const allergyIntoleranceCollection = "allergyIntolerance";
const medicationDispenseCollection = "medicationDispense";
const procedureCollection = "procedure";
const immunizationCollection = "immunization";
const conditionCollection = "condition";
const insuranceProvidersCollection = "insuranceProviders";

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
