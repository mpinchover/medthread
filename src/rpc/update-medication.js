import axios from "axios";
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export const updateMedication = async (params) => {
  const db = getFirestore();
  const docRef = doc(db, "medications", params.uid);
  await updateDoc(docRef, {
    ...params,
  });
};
