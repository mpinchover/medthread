import PatientSettings from "./settings-patient";
import { useRecoilValue, useRecoilCallback } from "recoil";
import { isLoadingSettingsState } from "../recoil/profile/profile";
import { LoadingSettingsData } from "./common";
import { useEffect } from "react";
import {
  insuranceProvidersState,
  healthcareProvidersState,
  getPatientProfileCallback,
} from "../recoil/profile/profile";

const Settings = () => {
  const insuranceProviders = useRecoilValue(insuranceProvidersState);
  const healthcareProviders = useRecoilValue(healthcareProvidersState);

  const getPatientProfileCbk = useRecoilCallback(getPatientProfileCallback);

  useEffect(() => {
    getPatientProfileCbk();
  }, []);

  const isLoadingSettings = useRecoilValue(isLoadingSettingsState);

  if (isLoadingSettings) return <LoadingSettingsData />;
  return (
    <PatientSettings
      healthcareProviders={healthcareProviders}
      insuranceProviders={insuranceProviders}
    />
  );
};
export default Settings;
