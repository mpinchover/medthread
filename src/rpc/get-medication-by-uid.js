import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getFirestore,
  getDoc,
} from "firebase/firestore";
import { getServerConfig } from "../config/config";

export const getMedicationByUid = async (uid) => {
  const db = getFirestore();
  const config = getServerConfig();

  const medRef = doc(db, "medications", uid);
  const medDoc = await getDoc(medRef);

  const medication = medDoc.data();
  const medicationId = medDoc.id;
  if (!medication) {
    throw new Error("NOT_FOUND");
  }
  return {
    ...medication,
    uid: medicationId,
  };
};
