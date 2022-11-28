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
import { getServerConfig } from "../config/config";

export const addMedication = async (params) => {
  const config = getServerConfig();
  
  const db = getFirestore();

  const medicationsRef = collection(db, "medications");
  const docRef = await addDoc(medicationsRef, params);
  params.uid = docRef.id;
  return params;
};
