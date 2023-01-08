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
  getClaimsDataByUserUidCallback,
  filteredClaimsDerivedMedicationsState,
  filteredClaimsImmunizationsState,
  claimsMedicationDispenseState,
  claimsMedicationRequestState,
  filteredClaimsProceduresState,
  filteredClaimsAllergyIntolerancesState,
  filteredClaimsConditionsState,
  recordsSearchQueryState,
  isFetchingClaimsDataState,
  // isLoadingClaimsDataState,
  // isLoadingClaimsDataState,
  isLoadingClaimsDataStateV2,
  isSavingNoteState,
} from "../recoil/claims/claims";
import { LoadingMedicationData, LoadingWindow } from "./common";
import { FirebaseContext } from "../firebase/firebase-context";
import { withPrivateRoute } from "./hocs";
import { isLoadingClaimsDataState } from "../recoil/utils/utils";

const MedicationListPatient = () => {
  const { getAuthUser } = useContext(FirebaseContext);

  const isLoadingClaimsData = useRecoilValue(isLoadingClaimsDataState);
  const authUser = getAuthUser();
  // const getMedications = useRecoilCallback(getMedicationsByUserUidCallback);
  const getClaimsDatabyUserUid = useRecoilCallback(
    getClaimsDataByUserUidCallback
  );
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

  // const isLoadingClaimsData = useRecoilValue(isLoadingClaimsDataState);
  // const [medicationList, setMedicationList] = useRecoilState(
  //   filteredDerivedMedicationsState
  // );

  const [searchTerm, setSearchTerm] = useRecoilState(recordsSearchQueryState);

  useEffect(() => {
    // getMedications();
    getClaimsDatabyUserUid();
  }, []);

  // const isLoadingClaimsData = useRecoilValue(isLoadingClaimsDataState);
  const isLoadingMedicationList = useRecoilValue(loadingGetMedicationState);
  const isSendingMedications = useRecoilValue(isSendingMedicationsState);
  const isAddingMedication = useRecoilValue(isAddingMedicationState);

  if (isLoadingClaimsData) {
    return <LoadingMedicationData />;
  }
  if (isSendingMedications) {
    return <LoadingWindow display="Sending records..." />;
  }

  if (isAddingMedication) {
    return <LoadingWindow display="Saving record..." />;
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

export default withPrivateRoute(MedicationListPatient);
