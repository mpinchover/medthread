import axios from "axios";
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { getServerConfig } from "../config/config";
export const removeMedication = async (uid) => {
  const config = getServerConfig();
  
  const db = getFirestore();
  const docRef = doc(db, "medications", uid);
  await deleteDoc(docRef);
};
