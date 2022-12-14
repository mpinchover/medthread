import { atom, selector } from "recoil";
import axios from "axios";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, updateEmail } from "firebase/auth";
import { getUserProfile } from "../../rpc/get-user-profile";
import { addAuthorizedHealthcareProviderdicationsByUid } from "../../rpc/add-authorized-healthcare-provider";
import { updateAccountSettings } from "../../rpc/update-account-settings";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { createHydratedUserProfile } from "../../rpc/create-hydrated-user";
import { useNavigate } from "react-router-dom";
import { authorizedProfileState } from "../auth/auth";
import { validateCreatePatient } from "../../validation/validation";

export const profileAccountState = atom({
  key: "profileAccountState",
  default: {
    displayName: "",
    mobile: "",
  },
});

export const isLoggingInUserState = atom({
  key: "isLoggingInUserState",
  default: false,
});

export const isUpdatingProfileAccountState = atom({
  key: "isUpdatingProfileAccountState",
  default: false,
});

export const insuranceProvidersState = atom({
  key: "insuranceProvidersState",
  default: [],
});

export const isAddingInsuranceProviderState = atom({
  key: "isaddingproviderstate",
  default: false,
});

export const healthcareProvidersState = atom({
  key: "healthcareProvidersState",
  default: [],
});

export const isAddingHealthcareProviderState = atom({
  key: "isAddingHealthcareProvidersState",
  default: false,
});

export const isLoadingSettingsState = atom({
  key: "isloadingsettingsstate",
  default: false,
});

export const addHealthcareProviderCallback =
  ({ set, snapshot }) =>
  async (healthcareProviderEmail, healthcareProviderName) => {
    try {
      set(isAddingHealthcareProviderState, true);
      const res = await addAuthorizedHealthcareProviderdicationsByUid(
        healthcareProviderEmail,
        healthcareProviderName
      );

      const listOfHealthcareProviders = Object.values(
        res.data.patient_profile.healthcareProviders
      );

      set(healthcareProvidersState, listOfHealthcareProviders);
    } catch (e) {
      set(isAddingHealthcareProviderState, false);
      console.log(e);
    }
    set(isAddingHealthcareProviderState, false);
  };

export const createPatientCallback =
  ({ set, snapshot }) =>
  async (params) => {
    try {
      let { email, password, confirmPassword, displayName } = params;

      validateCreatePatient({
        email,
        password,
        confirmPassword,
        name: displayName,
      });

      set(isLoggingInUserState, true);
      const auth = getAuth();
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const idToken = await res.user.getIdToken(/* forceRefresh */ true);
      if (!displayName) displayName = "";

      const newUser = {
        role: "PATIENT",
        userUid: res.user.uid,
        account: {
          displayName,
        },
      };

      let hydratedUserProfile;
      try {
        hydratedUserProfile = await createHydratedUserProfile(newUser);
      } catch (e) {
        console.log(e);
        let msg = e.message;
        if (!msg.toLowerCase().includes("already exists")) {
          throw e;
        }
      }

      const authUser = {
        uid: res.user.uid,
        email: res.user.email,
        emailVerified: res.user.emailVerified,
        providerData: res.user.providerData,
        ...hydratedUserProfile,
        idToken,
      };

      localStorage.setItem("med_thread_auth_user", JSON.stringify(authUser));
      if (hydratedUserProfile && hydratedUserProfile.account)
        set(profileAccountState, hydratedUserProfile.account);
      set(authorizedProfileState, authUser);
    } catch (e) {
      console.log(e);
      let msg = e.message;

      if (msg.includes("auth/email-already-in-use"))
        msg = "Email already in use.";
      toast.error(msg, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      throw e;
    } finally {
      set(isLoggingInUserState, false);
    }
  };

export const signInCallback =
  ({ set, snapshot }) =>
  async (params) => {
    try {
      set(isLoggingInUserState, true);
      const { email, password } = params;

      const auth = getAuth();
      const res = await signInWithEmailAndPassword(auth, email, password);
      const hydratedUserProfile = await getUserProfile(res.user.uid);
      const idToken = await res.user.getIdToken(/* forceRefresh */ true);

      const authUser = {
        uid: res.user.uid,
        email: res.user.email,
        emailVerified: res.user.emailVerified,
        providerData: res.user.providerData,
        ...hydratedUserProfile,
        idToken,
      };

      localStorage.setItem("med_thread_auth_user", JSON.stringify(authUser));
      // setProfileAccount(hydratedUserProfile.account);
      if (hydratedUserProfile?.account)
        set(profileAccountState, hydratedUserProfile.account);
      set(authorizedProfileState, authUser);
    } catch (e) {
      console.log(e);
      toast.error("Incorrect email/password", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      throw e;
    } finally {
      set(isLoggingInUserState, false);
    }
  };

export const createProviderCallback =
  ({ set, snapshot }) =>
  async (params) => {
    try {
      let { email, password, confirmPassword, displayName } = params;
      validateCreatePatient({
        email,
        password,
        confirmPassword,
        name: displayName,
      });

      set(isLoggingInUserState, true);
      const auth = getAuth();
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const idToken = await res.user.getIdToken(/* forceRefresh */ true);
      if (!displayName) displayName = "";

      const newUser = {
        role: "PROVIDER",
        userUid: res.user.uid,
        account: {
          displayName,
        },
      };

      let hydratedUserProfile;
      try {
        hydratedUserProfile = await createHydratedUserProfile(newUser);
      } catch (e) {
        console.log(e);
        let msg = e.message;
        if (!msg.toLowerCase().includes("already exists")) {
          throw e;
        }
      }

      const authUser = {
        uid: res.user.uid,
        email: res.user.email,
        emailVerified: res.user.emailVerified,
        providerData: res.user.providerData,
        ...hydratedUserProfile,
        idToken,
      };

      localStorage.setItem("med_thread_auth_user", JSON.stringify(authUser));
      if (hydratedUserProfile?.account)
        set(profileAccountState, hydratedUserProfile.account);
      set(authorizedProfileState, authUser);
    } catch (e) {
      console.log(e);
      let msg = e.message;

      if (msg.includes("auth/email-already-in-use"))
        msg = "Email already in use.";
      toast.error(msg, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      throw e;
    } finally {
      set(isLoggingInUserState, false);
    }
  };

export const addInsuranceProviderCallback =
  ({ set, snapshot }) =>
  async (publicToken) => {
    const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
    const { idToken } = authUser;
    try {
      set(isAddingInsuranceProviderState, true);
      const res = await axios({
        method: "post",
        url: "http://127.0.0.1:5001/healthcare-f57e8/us-central1/app/store-health-insurance-tokens",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST",
        data: {
          publicToken: publicToken,
        },
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const listOfInsuranceProviders = [];

      const insuranceProviders = Object.keys(
        res.data.patient_profile.insurance_providers
      );

      insuranceProviders.map((e, i) => {
        listOfInsuranceProviders.push({
          insuranceProviderName: e,
        });
      });

      set(insuranceProvidersState, listOfInsuranceProviders);
    } catch (e) {
      console.log(e);
    }
    set(isAddingInsuranceProviderState, false);
  };

export const getPatientProfileCallback =
  ({ set, snapshot }) =>
  async (publicToken) => {
    const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
    const { uid } = authUser;

    try {
      set(isLoadingSettingsState, true);
      const patientProfile = await getUserProfile(uid);

      const listOfInsuranceProviders = getInsuranceProviders(patientProfile);
      set(insuranceProvidersState, listOfInsuranceProviders);

      const listOfHealthcareProviders = getHealthcareProviders(patientProfile);
      set(healthcareProvidersState, listOfHealthcareProviders);

      const prevAccountState =
        snapshot.getLoadable(profileAccountState).contents;

      set(profileAccountState, {
        ...prevAccountState,
        ...patientProfile.account,
      });
    } catch (e) {
      console.log(e);
    }
    set(isLoadingSettingsState, false);
  };

const getInsuranceProviders = (patientProfile) => {
  const results = [];
  if (!patientProfile.insurance_providers) return results;

  for (const [key, value] of Object.entries(
    patientProfile.insurance_providers
  )) {
    results.push({
      insuranceProviderName: key,
    });
  }
  return results;
};

const getHealthcareProviders = (patientProfile) => {
  const results = [];
  if (!patientProfile.healthcareProviders) return results;

  for (const [key, value] of Object.entries(
    patientProfile.healthcareProviders
  )) {
    results.push(value);
  }
  return results;
};
