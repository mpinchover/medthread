import * as admin from "firebase-admin";
import { Medication } from "../types";

export const addMedication = async (params: Medication) => {
  const db = admin.firestore();

  const docRef = db.collection("medications").doc();
  params.uid = docRef.id;
  await docRef.set(params);
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

export const removeMediation = async (medUid: string) => {
  const db = admin.firestore();

  const medDoc = db.collection("medications").doc(medUid);
  await medDoc.delete();
};
