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

  const getAccountSettings = useRecoilCallback(getAccountSettingsCallback);

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

      // // might be this
      // if (authUser?.role || getAuthUser()?.uid !== authUser?.uid) {
      //   signOutUser();
      // }

      localStorage.setItem("med_thread_auth_user", JSON.stringify(authUser));

      setProfileAccount(hydratedUserProfile.account);
      // _setAuthorizedProfileState(authUser);
      setAuthorizedProfile(authUser);
    });

    const removeIdTokenListener = onIdTokenChanged(auth, async (user) => {
      if (!user) {
        // localStorage.clear();
        return;
      }

      const curAuthUserCache = getAuthUser();
      // if (curAuthUserCache && curAuthUserCache.uid !== user?.uid) {
      //   localStorage.clear();
      //   setAuthorizedProfile(null);
      //   return;
      // }

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
      // _setAuthorizedProfileState(authUser);
      setAuthorizedProfile(authUser);
    });

    return () => {
      removeIdTokenListener();
      unsubscribe();
    };
  }, []);

  const createProvider = async (
    email,
    password,
    confirmPassword,
    displayName
  ) => {
    try {
      const auth = getAuth();
      await _createProvider(
        { email, password, confirmPassword, displayName },
        auth
      );
      verifyEmailAddress();
      navigate("/settings", { replace: true });
      // window.location.reload();
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
      const auth = getAuth();
      await _createPatient(
        { email, password, confirmPassword, displayName },
        auth
      );
      navigate("/settings", { replace: true });
      // window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };

  const signIn = async (email, password) => {
    try {
      await _signIn({ email, password });
      navigate("/settings", { replace: true });
      // window.location.reload();
      // await navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  // const updateAccountInformation = async (params) => {
  //   const auth = getAuth();
  //   updateAccountSettingsCbk(auth, params);
  // };

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
      const auth = getAuth();
      await signOut(auth);
      localStorage.clear();
      setAuthorizedProfile(null);
      window.location.reload();
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
