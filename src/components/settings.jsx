import PatientSettings from "./settings-patient";
import ProviderSettings from "./settings-provider";
import { useRecoilValue, useRecoilCallback } from "recoil";
import { isLoadingSettingsState } from "../recoil/profile/profile";
import { LoadingSettingsData } from "./common";
import { useEffect, useContext } from "react";
import {
  insuranceProvidersState,
  healthcareProvidersState,
  getPatientProfileCallback,
} from "../recoil/profile/profile";
import {
  getAccountSettingsCallback,
  accountSettingsState,
} from "../recoil/account/account";
import { withPrivateRoute } from "./hocs";
import { FirebaseContext } from "../firebase/firebase-context";
import { authorizedProfileState } from "../recoil/auth/auth";

const Settings = () => {
  const { getAuthUser } = useContext(FirebaseContext);
  const insuranceProviders = useRecoilValue(insuranceProvidersState);
  const healthcareProviders = useRecoilValue(healthcareProvidersState);
  const authProfile = useRecoilValue(authorizedProfileState);
  const getPatientProfileCbk = useRecoilCallback(getPatientProfileCallback);
  const getAccountSettings = useRecoilCallback(getAccountSettingsCallback);
  const accountSettings = useRecoilValue(accountSettingsState);
  useEffect(() => {
    // getAccountSettings();
    // getPatientProfileCbk();
    // getAccountSettings();
  }, []);
  const isLoadingSettings = useRecoilValue(isLoadingSettingsState);

  if (isLoadingSettings) return <LoadingSettingsData />;

  // if (authUser.role === "PROVIDER") {
  //   return <ProviderSettings />;
  // }

  return (
    <PatientSettings
      authProfile={authProfile}
      accountSettings={accountSettings}
      healthcareProviders={healthcareProviders}
      insuranceProviders={insuranceProviders}
    />
  );
};
export default withPrivateRoute(Settings);
