import { getFirestore, collection, addDoc } from "firebase/firestore";

export const createHydratedUserProfile = async (params) => {
  const db = getFirestore();
  const profilesRef = collection(db, "profiles");
  const docRef = await addDoc(profilesRef, params);
  params.profileUid = docRef.id;
  return params;
};
