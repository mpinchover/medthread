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

export const addMedication = async (params) => {
  const db = getFirestore();

  const medicationsRef = collection(db, "medications");
  const docRef = await addDoc(medicationsRef, params);
  params.uid = docRef.id;
  return params;
};
