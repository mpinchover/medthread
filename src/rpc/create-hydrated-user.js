import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getServerConfig } from "../config/config";

export const createHydratedUserProfile = async (params) => {
  const config = getServerConfig();
  const db = getFirestore();
  const profilesRef = collection(db, "profiles");
  const docRef = await addDoc(profilesRef, params);
  params.profileUid = docRef.id;
  return params;
};
