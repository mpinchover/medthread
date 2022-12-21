import MedicationList from "./medication-list";
import { useRecoilValue, useRecoilCallback, useRecoilState } from "recoil";
import { useEffect, useContext } from "react";
import {
  filteredDerivedMedicationsState,
  isSendingMedicationsState,
  medicationSearchTermState,
  getMedicationsByUserUidCallback,
  loadingGetMedicationState,
  isAddingMedicationState,
} from "../recoil/medications/medications";
import { accountSettingsState } from "../recoil/account/account";

import { LoadingMedicationData, LoadingWindow } from "./common";
import { FirebaseContext } from "../firebase/firebase-context";
import { withPrivateRoute } from "./hocs";

const MedicationListPatient = () => {
  const { getAuthUser } = useContext(FirebaseContext);

  const authUser = getAuthUser();
  const getMedications = useRecoilCallback(getMedicationsByUserUidCallback);
  const accountSettings = useRecoilValue(accountSettingsState);
  const [medicationList, setMedicationList] = useRecoilState(
    filteredDerivedMedicationsState
  );

  const [searchTerm, setSearchTerm] = useRecoilState(medicationSearchTermState);

  useEffect(() => {
    getMedications();
  }, []);

  const isLoadingMedicationList = useRecoilValue(loadingGetMedicationState);
  const isSendingMedications = useRecoilValue(isSendingMedicationsState);
  const isAddingMedication = useRecoilValue(isAddingMedicationState);
  if (isLoadingMedicationList) {
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
      meds={medicationList}
    />
  );
};

export default withPrivateRoute(MedicationListPatient);
