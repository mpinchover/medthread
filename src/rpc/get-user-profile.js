import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { getServerConfig } from "../config/config";
export const getUserProfile = async (uid) => {
  const db = getFirestore();
  const config = getServerConfig();

  const profiles = collection(db, "profiles");

  const q = query(profiles, where("userUid", "==", uid));

  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return [];

  return querySnapshot.docs[0].data();
};
