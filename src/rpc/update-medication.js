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

export const updateMedication = async (params) => {
  const config = getServerConfig();
  
  const db = getFirestore();
  const docRef = doc(db, "medications", params.uid);
  await updateDoc(docRef, {
    ...params,
  });
};
