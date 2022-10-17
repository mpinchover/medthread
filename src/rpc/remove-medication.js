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

export const removeMedication = async (uid) => {
  const db = getFirestore();
  const docRef = doc(db, "medications", uid);
  await deleteDoc(docRef);
};
