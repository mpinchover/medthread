import { updateProfile } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

export const updateAccountSettings = async (params) => {
  const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
  const { profileUid } = authUser;

  const db = getFirestore();
  const userProfileRef = doc(db, "profiles", profileUid);
  const userProfile = await getDoc(userProfileRef);

  const accountSettings = userProfile.data().account;

  const updatedProfile = {
    ...userProfile.data(),
    account: {
      ...accountSettings,
      ...params,
    },
  };

  await updateDoc(userProfileRef, updatedProfile);
  return updatedProfile.account;
};
