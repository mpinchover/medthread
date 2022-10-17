import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";

export const getUserProfile = async (uid) => {
  const db = getFirestore();

  const profiles = collection(db, "profiles");

  const q = query(profiles, where("userUid", "==", uid));

  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return [];

  return querySnapshot.docs[0].data();
};
