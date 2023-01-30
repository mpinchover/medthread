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
  sendSignInLinkToEmail,
  sendEmailVerification,
  updateEmail,
  onIdTokenChanged,
} from "firebase/auth";
import { useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";
import { authorizedProfileState } from "../recoil/auth/auth";
import {
  profileAccountState,
  createPatientCallback,
  createProviderCallback,
  isLoggingInUserState,
  signInCallback,
  hydrateUserProfileCallback,
} from "../recoil/profile/profile";
import {
  updateEmailCallback,
  getAccountSettingsCallback,
  updatePasswordCallback,
} from "../recoil/account/account";
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
  const [authorizedProfile, setAuthorizedProfile] = useRecoilState(
    authorizedProfileState
  );

  const updateEmailCbk = useRecoilCallback(updateEmailCallback);
  const [profileAccount, setProfileAccount] =
    useRecoilState(profileAccountState);
  const [isLoggingInUser, setIsLoggingInUser] =
    useRecoilState(isLoggingInUserState);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const _createPatient = useRecoilCallback(createPatientCallback);
  const _createProvider = useRecoilCallback(createProviderCallback);
  const _updateUserPasswordCallback = useRecoilCallback(updatePasswordCallback);
  const _signIn = useRecoilCallback(signInCallback);
  const navigate = useNavigate();
  const hydrateUserProfile = useRecoilCallback(hydrateUserProfileCallback);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log("NO USER FOUND");
        // could be this issue here.
        // console.log("NO USER FOUND");
        // localStorage.clear();
        // setAuthorizedProfile(null);
        return;
      }

      const auth = getAuth();
      const authUser = getAuthUser();
      if (authUser?.role) {
        hydrateUserProfile(auth, user);
      }
    });

    const removeIdTokenListener = onIdTokenChanged(auth, async (user) => {
      if (!user) {
        // console.log("NO USER FOUND");
        return;
      }

      // const auth = getAuth();
      // const authUser = getAuthUser();
      // if (authUser?.role) {
      //   hydrateUserProfile(auth, user);
      // }
    });

    return () => {
      removeIdTokenListener();
      unsubscribe();
    };
  }, []);

  const createProvider = async (params) => {
    try {
      const auth = getAuth();
      await _createProvider(params, auth);
      verifyEmailAddress();
      navigate("/", { replace: true });
    } catch (e) {
      console.log(e);
    }
  };

  const createPatient = async (params, providerUid) => {
    try {
      const auth = getAuth();
      const { email, password, confirmPassword, nameValue } = params;

      await _createPatient(params, auth, providerUid);
      navigate("/settings", { replace: true });
    } catch (e) {
      console.log(e);
    }
  };

  const signIn = async (email, password) => {
    try {
      await _signIn({ email, password });
      navigate("/", { replace: true });
    } catch (e) {
      console.log(e);
    }
  };

  const updateUserEmail = async (email) => {
    const auth = getAuth();
    updateEmailCbk(auth, email);
  };

  const sendResetPasswordEmail = (email) => {
    try {
      const auth = getAuth();
      sendPasswordResetEmail(auth, email);
      navigate("/", { replace: true });
    } catch (e) {
      console.log(e);
      alert("Failed to reset password");
    }
  };

  const updateUserPassword = async (password) => {
    try {
      const auth = getAuth();
      await _updateUserPasswordCallback(auth.currentUser, password);
    } catch (e) {
      console.log(e);
      alert("Failed to update password");
    }
  };

  const signOutUser = async () => {
    try {
      localStorage.clear();
      setAuthorizedProfile(null);
      const auth = getAuth();
      await signOut(auth);
      // window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };

  const getAuthUser = () => {
    return JSON.parse(localStorage.getItem("med_thread_auth_user"));
  };

  // todo - verify the email address exists?
  const verifyEmailAddress = async () => {
    try {
      let url = "";
      if (process.env.REACT_APP_MEDTHREAD_ENV === "PRODUCTION") {
        url = "https://usemedthread.com";
      } else if (process.env.REACT_APP_MEDTHREAD_ENV === "STAGING") {
        url = "https://staging.usemedthread.com";
      } else if (process.env.REACT_APP_MEDTHREAD_ENV === "DEMO") {
        url = "https://demo.usemedthread.com";
      } else {
        url = "http://localhost:3000";
      }

      const auth = getAuth();
      const authUser = getAuthUser();
      const { email } = authUser;

      // await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      await sendEmailVerification(auth.currentUser, {
        url,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        signIn,
        signOutUser,
        createPatient,
        createProvider,
        sendResetPasswordEmail,
        updateUserEmail,
        updateUserPassword,
        getAuthUser,
        verifyEmailAddress,
        isModalOpen,
        setIsModalOpen,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
