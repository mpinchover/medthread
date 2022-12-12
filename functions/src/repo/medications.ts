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
