import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
  doc,
} from "firebase/firestore";
import { getServerConfig } from "../config/config";
export const getPatientSourcedMedications = async (patientUid) => {
  const config = getServerConfig();
  const db = getFirestore();
  const medications = collection(db, "medications");
  const q = query(medications, where("userUid", "==", patientUid));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) return [];

  const results = [];
  querySnapshot.docs.map((e, i) => {
    results.push({
      ...e.data(),
      uid: e.id,
    });
  });
  return results;
};
