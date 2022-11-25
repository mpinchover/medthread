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
import { withPrivateRoute } from "./hocs";
import { FirebaseContext } from "../firebase/firebase-context";

const Settings = () => {
  const { getAuthUser } = useContext(FirebaseContext);
  const insuranceProviders = useRecoilValue(insuranceProvidersState);
  const healthcareProviders = useRecoilValue(healthcareProvidersState);

  const getPatientProfileCbk = useRecoilCallback(getPatientProfileCallback);

  useEffect(() => {
    getPatientProfileCbk();
  }, []);

  const authUser = getAuthUser();
  const isLoadingSettings = useRecoilValue(isLoadingSettingsState);

  if (isLoadingSettings) return <LoadingSettingsData />;

  if (authUser.role === "PROVIDER") {
    return <ProviderSettings />;
  }
  return (
    <PatientSettings
      healthcareProviders={healthcareProviders}
      insuranceProviders={insuranceProviders}
    />
  );
};
export default withPrivateRoute(Settings);
