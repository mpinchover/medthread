import PatientSettings from "./settings-patient";
import ProviderSettings from "./settings-provider";
import { useRecoilValue, useRecoilCallback, useRecoilState } from "recoil";
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
import { activeCareProviderPatientState } from "../recoil/provider/provider";

const Settings = () => {
  const { getAuthUser } = useContext(FirebaseContext);
  const insuranceProviders = useRecoilValue(insuranceProvidersState);
  const healthcareProviders = useRecoilValue(healthcareProvidersState);
  const authProfile = useRecoilValue(authorizedProfileState);
  const getAccountSettings = useRecoilCallback(getAccountSettingsCallback);
  const accountSettings = useRecoilValue(accountSettingsState);
  const [activeCareProviderActivePatient, setActiveCareProviderPatient] =
    useRecoilState(activeCareProviderPatientState);
  useEffect(() => {
    setActiveCareProviderPatient(null);
    if (authProfile) {
      getAccountSettings();
    }
  }, [authProfile.uuid]);
  const isLoadingSettings = useRecoilValue(isLoadingSettingsState);

  if (isLoadingSettings) return <LoadingSettingsData />;

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
