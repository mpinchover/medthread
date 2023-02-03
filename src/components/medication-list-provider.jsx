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
import { getAuth } from "firebase/auth";
import { authorizedProfileState } from "../recoil/auth/auth";
import { getPatientTimelineDataCallback } from "../recoil/timeline/timeline";
import { isLoadingTimelineDataState } from "../recoil/timeline/timeline";

const MedicationListProvider = () => {
  const { getAuthUser } = useContext(FirebaseContext);
  const isLoadingClaimsData = useRecoilValue(isLoadingClaimsDataState);
  const isLoadingTimelineData = useRecoilValue(isLoadingTimelineDataState);
  const authUser = getAuthUser();
  // const getMedications = useRecoilCallback(getMedicationsByUserUidCallback);
  const getClaimsDatabyUserUuid = useRecoilCallback(
    getClaimsDataByUserUuidCallback
  );
  const getPatientTimelineData = useRecoilCallback(
    getPatientTimelineDataCallback
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
  const { patientUid } = useParams();
  const auth = getAuth();
  // get the patient uis from the params

  const { patientUuid } = useParams();

  useEffect(() => {
    if (auth?.currentUser) {
      getClaimsDatabyUserUuid(auth, patientUuid, authProfile?.uuid);
      getPatientTimelineData(auth, patientUuid, authProfile?.uuid);
    }
  }, [authProfile]);

  const isLoadingMedicationList = useRecoilValue(loadingGetMedicationState);
  const isSendingMedications = useRecoilValue(isSendingMedicationsState);
  const isAddingMedication = useRecoilValue(isAddingMedicationState);

  if (isLoadingClaimsData || isLoadingTimelineData) {
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
