import React, { useEffect, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  updateEmail,
} from "firebase/auth";
import { useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";
import { authorizedProfileState } from "../recoil/auth/auth";
import {
  profileAccountState,
  updateAccountSettingsCallback,
  createPatientCallback,
  createProviderCallback,
  isLoggingInUserState,
  signInCallback,
} from "../recoil/profile/profile";
import {
  collection,
  query,
  where,
  addDoc,
  getFirestore,
  getDocs,
  limit,
} from "firebase/firestore";
import { AiOutlineConsoleSql } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export const FirebaseContext = React.createContext();

export const FirebaseProvider = ({ children }) => {
  const [_authorizedProfileState, _setAuthorizedProfileState] = useRecoilState(
    authorizedProfileState
  );
  const updateAccountSettingsCbk = useRecoilCallback(
    updateAccountSettingsCallback
  );
  const [profileAccount, setProfileAccount] =
    useRecoilState(profileAccountState);
  const [isLoggingInUser, setIsLoggingInUser] =
    useRecoilState(isLoggingInUserState);

  const _createPatient = useRecoilCallback(createPatientCallback);
  const _createProvider = useRecoilCallback(createProviderCallback);
  const _signIn = useRecoilCallback(signInCallback);
  const navigate = useNavigate();

  const hydrateUserProfile = async (uid) => {
    if (!uid) return;

    const db = getFirestore();
    const profilesRef = collection(db, "profiles");
    const q = query(profilesRef, where("userUid", "==", uid), limit(1));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot || querySnapshot.docs.length === 0) {
      return;
    }

    const hydratedUser = querySnapshot.docs[0].data();
    hydratedUser.profileUid = querySnapshot.docs[0].id;
    return hydratedUser;
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        return;
      }

      const hydratedUserProfile = await hydrateUserProfile(user.uid);
      const idToken = await auth.currentUser.getIdToken(
        /* forceRefresh */ true
      );

      const authUser = {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        providerData: user.providerData,
        ...hydratedUserProfile,
        idToken,
      };

      localStorage.setItem("med_thread_auth_user", JSON.stringify(authUser));

      setProfileAccount(hydratedUserProfile.account);
      _setAuthorizedProfileState(authUser);
    });
    return unsubscribe;
  }, []);

  const createProvider = async (
    email,
    password,
    confirmPassword,
    displayName
  ) => {
    try {
      await _createProvider({ email, password, confirmPassword, displayName });
      navigate("/settings");
    } catch (e) {
      console.log(e);
    }
  };

  const createPatient = async (
    email,
    password,
    confirmPassword,
    displayName
  ) => {
    try {
      await _createPatient({ email, password, confirmPassword, displayName });
      navigate("/settings");
    } catch (e) {
      console.log(e);
    }
  };

  const signIn = async (email, password) => {
    try {
      await _signIn({ email, password });

      // await navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  const updateAccountInformation = async (params) => {
    const auth = getAuth();
    updateAccountSettingsCbk(auth, params);
  };

  const sendResetPasswordEmail = (email) => {
    try {
      const auth = getAuth();
      sendPasswordResetEmail(auth, email);
      navigate("/");
    } catch (e) {
      console.log(e);
      alert("Failed to reset password");
    }
  };

  const updateUserPassword = async (password) => {
    try {
      const auth = getAuth();
      await updatePassword(auth.currentUser, password);
    } catch (e) {
      console.log(e);
      alert("Failed to update password");
    }
  };

  const signOutUser = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      localStorage.clear();
    } catch (e) {
      console.log(e);
    }
  };

  const getAuthUser = () => {
    return JSON.parse(localStorage.getItem("med_thread_auth_user"));
  };

  return (
    <FirebaseContext.Provider
      value={{
        signIn,
        signOutUser,
        createPatient,
        createProvider,
        sendResetPasswordEmail,
        updateAccountInformation,
        updateUserPassword,
        getAuthUser,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
