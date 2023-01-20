import { atom } from "recoil";
import { getAuth, updateEmail, updatePassword } from "firebase/auth";
import { removeHealthInsuranceProvider } from "../../rpc/remove-insurance-provider";
import { addHealthInsuranceProvider } from "../../rpc/add-health-insurance-provider";
import { getAccountSettings } from "../../rpc/get-account-settings";
import { derivedMedicationsState } from "../medications/medications";

const idleState = {
  isEditingPassword: false,
  isUpdatingPassword: false,
  isEditingEmail: false,
  isUpdatingEmail: false,
  isRemovingInsuranceProvider: false,
  isSavingInsuranceProvider: false,
};

export const accountUpdateState = atom({
  key: "accountUpdateState",
  default: idleState,
});

const defaultAccountSettingsState = {
  insuranceProviders: [],
  healthcareProviders: [],
};

export const accountSettingsState = atom({
  key: "accountSettingsState",
  default: defaultAccountSettingsState,
});

export const isAccountLoadingState = atom({
  key: "isAccountLoadingState",
  default: false,
});

export const isAccountLoadingStateV2 = atom({
  key: "isAccountLoadingStateV2",
  default: false,
});

export const updateEmailCallback =
  ({ set, snapshot }) =>
  async (auth, email) => {
    try {
      if (!email) alert("Email required for update");
      set(isAccountLoadingState, true);
      await updateEmail(auth.currentUser, email);

      const newAccountUpdateState = {
        ...idleState,
        isEditingEmail: false,
      };
      set(accountUpdateState, newAccountUpdateState);
    } catch (e) {
      console.log(e);
    } finally {
      set(isAccountLoadingState, false);
    }
  };

export const updatePasswordCallback =
  ({ set, snapshot }) =>
  async (authUser, password) => {
    try {
      if (!password) alert("Password required for update");
      set(isAccountLoadingState, true);

      await updatePassword(authUser, password);

      const newAccountUpdateState = {
        ...idleState,
        isEditingPassword: false,
      };
      set(accountUpdateState, newAccountUpdateState);
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

      const currentAccountState =
        snapshot.getLoadable(accountSettingsState).contents;

      const newInsuranceProvidersState =
        currentAccountState.insuranceProviders.filter(
          (x) => x.uid !== healthInsuranceProviderUid
        );

      const newAccountSettingsState = {
        ...currentAccountState,
        insuranceProviders: newInsuranceProvidersState,
      };
      set(accountSettingsState, newAccountSettingsState);
    } catch (e) {
      console.log(e);
    } finally {
      set(isAccountLoadingState, false);
    }
  };

// instead of ading meds, you need to add everything here
export const addInsuranceProviderCallback =
  ({ set, snapshot }) =>
  async (publicToken) => {
    try {
      set(isAccountLoadingState, true);
      const { insuranceProvider, claimsData } =
        await addHealthInsuranceProvider(publicToken);

      // if (claimsData?.derivedClaimsMedications?.length > 0) {
      //   set(derivedMedicationsState, (curMeds) => [
      //     ...curMeds,
      //     ...claimsData.derivedClaimsMedications,
      //   ]);
      // }

      set(accountSettingsState, (prevAccountState) => {
        return {
          ...prevAccountState,
          insuranceProviders: [
            ...prevAccountState.insuranceProviders,
            insuranceProvider,
          ],
        };
      });
    } catch (e) {
      console.log(e);
    } finally {
      set(isAccountLoadingState, false);
    }
  };

export const getAccountSettingsCallback =
  ({ set, snapshot }) =>
  async () => {
    try {
      set(isAccountLoadingState, true);

      const account = await getAccountSettings();

      set(accountSettingsState, account);
    } catch (e) {
      console.log(e);
    } finally {
      set(isAccountLoadingState, false);
    }
  };
