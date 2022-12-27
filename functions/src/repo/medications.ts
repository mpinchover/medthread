import * as admin from "firebase-admin";
import { Medication, MedicationRequest } from "../types";

const medicationRequests = "medicationRequests";

export const addMedication = async (params: Medication) => {
  const db = admin.firestore();

  const docRef = db.collection("medications").doc();
  params.uid = docRef.id;
  await docRef.set(params);
  return params;
};

export const addMedicationsInbatch = async (params: Medication[]) => {
  if (!params || params.length === 0) return [];

  const db = admin.firestore();
  const batch = db.batch();

  for (let i = 0; i < params.length; i++) {
    const doc: Medication = params[i];
    const docRef = db.collection("medications").doc();
    doc.uid = docRef.id;
    batch.set(docRef, doc);

    params[i] = doc;
  }

  await batch.commit();
  return params;
};

export const updateMedication = async (params: Medication, uid: string) => {
  const db = admin.firestore();

  const docRef = db.collection("medications").doc(uid);
  await docRef.update(params);
  return params;
};

export const getMedicationsByUserUid = async (
  uid: string
): Promise<Medication[]> => {
  const db = admin.firestore();

  const medicationsRef = db.collection("medications");
  const snapshot = await medicationsRef.where("userUid", "==", uid).get();

  if (snapshot.empty) return [];
  return snapshot.docs.map((doc) => {
    const med: any = doc.data();
    return med;
  });
};

export const removeMedicationsByUids = async (docUids: string[]) => {
  const db = admin.firestore();
  const batch = db.batch();

  for (let i = 0; i < docUids.length; i++) {
    const docUid = docUids[i];
    const docRef = db.collection("medications").doc(docUid);

    batch.delete(docRef);
  }

  await batch.commit();
};

export const getMedicationsByFlepxaResourceIds = async (
  uid: string,
  flexpaResourceIds: string[]
): Promise<Medication[]> => {
  const db = admin.firestore();

  const medicationsRef = db.collection("medications");
  const snapshot = await medicationsRef
    .where("userUid", "==", uid)
    .where("flexpaResourceId", "in", flexpaResourceIds)
    .get();

  if (snapshot.empty) return [];
  return snapshot.docs.map((doc) => {
    const med: any = doc.data();
    return med;
  });
};

export const getMedicationsByInsuranceProviderUid = async (
  userUid: string,
  insuranceProviderUid: string
) => {
  const db = admin.firestore();

  const medicationsRef = db.collection("medications");
  const snapshot = await medicationsRef
    .where("userUid", "==", userUid)
    .where("insuranceProviderUid", "==", insuranceProviderUid)
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

export const removeMedications = async (medUid: string) => {
  const db = admin.firestore();

  const medDoc = db.collection("medications").doc(medUid);
  await medDoc.delete();
};
