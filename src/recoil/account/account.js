import { atom } from "recoil";
import { getAuth, updateEmail, updatePassword } from "firebase/auth";
import { removeHealthInsuranceProvider } from "../../rpc/remove-insurance-provider";
import { addHealthInsuranceProvider } from "../../rpc/add-health-insurance-provider";

const idleState = {
  isEditingPassword: false,
  isUpdatingPassword: false,
  isEditingEmail: false,
  isUpdatingEmail: false,
  isRemovingInsuranceProvider: false,
  isSavingInsuranceProvider: false,
};

export const accountState = atom({
  key: "accountState",
  default: idleState,
});

export const isAccountLoadingState = atom({
  key: "isAccountLoadingState",
  default: false,
});

export const updateEmailCallback =
  ({ set, snapshot }) =>
  async (auth, email) => {
    try {
      if (!email) alert("Email required for update");
      set(isAccountLoadingState, true);
      await updateEmail(auth.currentUser, email);

      //   const medications = await getMedicationsForPatient();
      //   set(derivedMedicationsState, medications);
    } catch (e) {
      console.log(e);
    } finally {
      set(isAccountLoadingState, false);
    }
  };

export const updatePasswordCallback =
  ({ set, snapshot }) =>
  async (auth, password) => {
    try {
      if (!password) alert("Password required for update");
      set(isAccountLoadingState, true);
      await updatePassword(auth.currentUser, password);
    } catch (e) {
      console.log(e);
    } finally {
      set(isAccountLoadingState, false);
    }
  };

export const removeInsuranceProviderCallback =
  ({ set, snapshot }) =>
  async (healthInsuranceProviderUid) => {
    try {
      set(isAccountLoadingState, true);
      await removeHealthInsuranceProvider(healthInsuranceProviderUid);
    } catch (e) {
      console.log(e);
    } finally {
      set(isAccountLoadingState, false);
    }
  };

export const addInsuranceProviderCallback =
  ({ set, snapshot }) =>
  async (publicToken) => {
    try {
      set(isAccountLoadingState, true);
      await addHealthInsuranceProvider(publicToken);
    } catch (e) {
      console.log(e);
    } finally {
      set(isAccountLoadingState, false);
    }
  };
