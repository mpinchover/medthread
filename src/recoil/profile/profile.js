import { atom, selector } from "recoil";
import axios from "axios";
import { getAuth, updateEmail } from "firebase/auth";
import { addAuthorizedHealthcareProviderdicationsByUid } from "../../rpc/add-authorized-healthcare-provider";
import { updateAccountSettings } from "../../rpc/update-account-settings";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { createHydratedUserProfile } from "../../rpc/create-hydrated-user";

import { authorizedProfileState } from "../auth/auth";
import { validateCreatePatient } from "../../validation/validation";
import { hydrateUserProfile } from "../../rpc/hydrate-user-profile";
import { capitalizeFirstLetter } from "../../components/utils";

export const profileAccountState = atom({
  key: "profileAccountState",
  default: {
    nameValue: "",
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

// pass in auth
export const hydrateUserProfileCallback =
  ({ set, snapshot }) =>
  async (auth, user) => {
    try {
      // i think its this
      // const curAuthProfile = snapshot.getLoadable(
      //   authorizedProfileState
      // ).contents;
      // if (!curAuthProfile?.role) {
      //   // console.log("CLEARING");
      //   // localStorage.clear();
      //   // set(authorizedProfileState, null);
      //   return null;
      // }
      // const config = getServerConfig();
      // const authUser = JSON.parse(localStorage.getItem("med_thread_auth_user"));
      // const { idToken } = authUser;
      set(isLoadingSettingsState, true);

      const { uuid } = JSON.parse(localStorage.get("med_thread_auth_user"));

      const idToken = await auth.currentUser.getIdToken(
        /* forceRefresh */ true
      );

      const hydratedProfile = await hydrateUserProfile(idToken);

      if (!idToken) {
        throw new Error("No auth token");
      }

      const authUser = {
        authUid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        providerData: user.providerData,
        ...hydratedProfile,
        idToken,
      };

      localStorage.setItem("med_thread_auth_user", JSON.stringify(authUser));

      set(profileAccountState, hydratedProfile?.account);
      set(authorizedProfileState, authUser);
    } catch (e) {
      console.log("ERROR IS");
      console.log(e);
    } finally {
      set(isLoadingSettingsState, false);
    }
  };

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
  async (params, auth, providerUuid) => {
    try {
      let { emailValue, passwordValue, confirmPasswordValue, nameValue } =
        params;
      if (nameValue !== "") {
        nameValue = capitalizeFirstLetter(nameValue);
      }

      validateCreatePatient(params);

      set(isLoggingInUserState, true);
      const res = await createUserWithEmailAndPassword(
        auth,
        emailValue,
        passwordValue
      );

      const idToken = await res.user.getIdToken(/* forceRefresh */ true);
      if (!nameValue) nameValue = "";

      const newUserParams = {
        userRole: "PATIENT",
        authUid: res.user.uid,
        nameValue,
      };

      // TODO – create hydrated user profile on backend
      let hydratedUserProfile;
      try {
        hydratedUserProfile = await createHydratedUserProfile(
          newUserParams,
          providerUuid
        );
      } catch (e) {
        console.log(e);
        let msg = e.message;
        if (!msg.toLowerCase().includes("already exists")) {
          throw e;
        }
      }

      const authUser = {
        authUid: res.user.uid,
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
      const idToken = await res.user.getIdToken(/* forceRefresh */ true);

      const hydratedUserProfile = await hydrateUserProfile(idToken);

      const authUser = {
        authUid: res.user.uid,
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
  async (params, auth) => {
    try {
      let { emailValue, passwordValue, confirmPasswordValue, nameValue } =
        params;
      if (nameValue !== "") {
        nameValue = capitalizeFirstLetter(nameValue);
      }

      validateCreatePatient(params);

      set(isLoggingInUserState, true);
      const res = await createUserWithEmailAndPassword(
        auth,
        emailValue,
        passwordValue
      );

      const idToken = await res.user.getIdToken(/* forceRefresh */ true);
      if (!nameValue) nameValue = "";

      const newUser = {
        userRole: "PROVIDER",
        authUid: res.user.uid,
        nameValue,
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
        authUid: res.user.uid,
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
      const patientProfile = await hydrateUserProfile(authUser.idToken);

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
