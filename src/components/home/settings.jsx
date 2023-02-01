import PatientSettings from "./settings-patient";
import { useRecoilValue, useRecoilCallback, useRecoilState } from "recoil";
import { isLoadingSettingsState } from "../../recoil/profile/profile";
import { LoadingSettingsData } from "../common";
import { useEffect, useContext } from "react";
import {
  insuranceProvidersState,
  healthcareProvidersState,
  getPatientProfileCallback,
} from "../../recoil/profile/profile";
import {
  getAccountSettingsCallback,
  accountSettingsState,
} from "../../recoil/account/account";
import { withPrivateRoute } from "../hocs";
import { FirebaseContext } from "../../firebase/firebase-context";
import { authorizedProfileState } from "../../recoil/auth/auth";
import { activeCareProviderPatientState } from "../../recoil/provider/provider";
import WelcomePage from "./welcome-page";
import { getAuth } from "firebase/auth";

const Settings = () => {
  const auth = getAuth();
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
    if (auth?.currentUser) {
      getAccountSettings(auth);
    }
  }, [auth.currentUser]);
  const isLoadingSettings = useRecoilValue(isLoadingSettingsState);

  if (isLoadingSettings) return <LoadingSettingsData />;

  // if (accountSettings?.insuranceProviders?.length === 0) {
  //   return <WelcomePage />;
  // }

  if (authProfile.role === "PATIENT") {
    return (
      <WelcomePage
        authProfile={authProfile}
        accountSettings={accountSettings}
        healthcareProviders={healthcareProviders}
        insuranceProviders={insuranceProviders}
      />
    );
  }

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
