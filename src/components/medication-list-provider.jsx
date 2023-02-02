import MedicationList from "./medication-list";
import { useRecoilValue, useRecoilCallback, useRecoilState } from "recoil";
import { useEffect, useContext } from "react";
import {
  // filteredDerivedMedicationsState,
  isSendingMedicationsState,
  getMedicationsByUserUidCallback,
  loadingGetMedicationState,
  isAddingMedicationState,
} from "../recoil/medications/medications";
import { accountSettingsState } from "../recoil/account/account";
import {
  getClaimsDataByUserUuidCallback,
  filteredClaimsDerivedMedicationsState,
  filteredClaimsImmunizationsState,
  claimsMedicationDispenseState,
  claimsMedicationRequestState,
  filteredClaimsProceduresState,
  filteredClaimsAllergyIntolerancesState,
  filteredClaimsConditionsState,
  recordsSearchQueryState,
} from "../recoil/claims/claims";
import { activeCareProviderPatientState } from "../recoil/provider/provider";
import { LoadingMedicationData, LoadingWindow } from "./common";
import { FirebaseContext } from "../firebase/firebase-context";
import { withPrivateRoute } from "./hocs";
import { useParams } from "react-router-dom";
import { isLoadingClaimsDataState } from "../recoil/utils/utils";
import { authorizedProfileState } from "../recoil/auth/auth";

const MedicationListProvider = () => {
  const { getAuthUser } = useContext(FirebaseContext);
  const isLoadingClaimsData = useRecoilValue(isLoadingClaimsDataState);
  const authUser = getAuthUser();
  // const getMedications = useRecoilCallback(getMedicationsByUserUidCallback);
  const getClaimsDatabyUserUuid = useRecoilCallback(
    getClaimsDataByUserUuidCallback
  );
  const [activeCareProviderPatient, setActiveCareProviderPatient] =
    useRecoilState(activeCareProviderPatientState);
  const claimsAllergyIntolerance = useRecoilValue(
    filteredClaimsAllergyIntolerancesState
  );
  const claimsConditions = useRecoilValue(filteredClaimsConditionsState);
  const claimsDerivedMedications = useRecoilValue(
    filteredClaimsDerivedMedicationsState
  );
  const claimsImmunizations = useRecoilValue(filteredClaimsImmunizationsState);
  const claimsMedicationDispense = useRecoilValue(
    claimsMedicationDispenseState
  );
  const claimsMedicationRequest = useRecoilValue(claimsMedicationRequestState);
  const claimsProcedures = useRecoilValue(filteredClaimsProceduresState);

  const accountSettings = useRecoilValue(accountSettingsState);

  const authProfile = useRecoilValue(authorizedProfileState);
  // const [medicationList, setMedicationList] = useRecoilState(
  //   filteredDerivedMedicationsState
  // );

  const [searchTerm, setSearchTerm] = useRecoilState(recordsSearchQueryState);
  const { patientUuid } = useParams();

  // get the patient uis from the params
  useEffect(() => {
    // getMedications();
    getClaimsDatabyUserUuid(patientUuid, authProfile?.uuid);
  }, [authProfile]);

  const isLoadingMedicationList = useRecoilValue(loadingGetMedicationState);
  const isSendingMedications = useRecoilValue(isSendingMedicationsState);
  const isAddingMedication = useRecoilValue(isAddingMedicationState);

  if (isLoadingClaimsData) {
    return <LoadingMedicationData />;
  }
  if (isSendingMedications) {
    return <LoadingWindow display="Sending medications..." />;
  }

  if (isAddingMedication) {
    return <LoadingWindow display="Saving medication..." />;
  }
  return (
    <MedicationList
      accountSettings={accountSettings}
      authUser={authUser}
      searchTerm={searchTerm}
      onChange={setSearchTerm}
      // meds={medicationList}
      claimsAllergyIntolerance={claimsAllergyIntolerance}
      claimsConditions={claimsConditions}
      claimsImmunizations={claimsImmunizations}
      claimsProcedures={claimsProcedures}
      claimsDerivedMedications={claimsDerivedMedications}
    />
  );
};

export default withPrivateRoute(MedicationListProvider);
