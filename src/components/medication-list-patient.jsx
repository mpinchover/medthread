import MedicationList from "./medication-list";
import { useRecoilValue, useRecoilCallback, useRecoilState } from "recoil";
import { loadMedicationList } from "../recoil/medications/medications";
import { useEffect, useState, useContext } from "react";
import {
  medicationsCallback,
  medicationList,
  getDerivedMedicationListCallback,
  loadingDerivedMedicationlistState,
  derivedMedicationsState,
  filteredDerivedMedicationsState,
  getMedicationsForPatientCallback,
  medicationSearchTermState,
} from "../recoil/medications/medications";

import { getAuth } from "firebase/auth";
import { LoadingMedicationData } from "./common";
import { FirebaseContext } from "../firebase/firebase-context";
import { withPrivateRoute } from "./hocs";

const MedicationListPatient = () => {
  const { getAuthUser } = useContext(FirebaseContext);

  // const authUser = getAuthUser();
  const authUser = {
    role: "PATIENT",
    account: {
      displayName: "Matt",
    },
  };
  const role = authUser.role;

  const getMedications = useRecoilCallback(getMedicationsForPatientCallback);

  const [medicationList, setMedicationList] = useRecoilState(
    filteredDerivedMedicationsState
  );

  const [searchTerm, setSearchTerm] = useRecoilState(medicationSearchTermState);

  useEffect(() => {
    getMedications();
  }, []);

  const isLoadingMedicationList = useRecoilValue(
    loadingDerivedMedicationlistState
  );

  if (isLoadingMedicationList) {
    return <LoadingMedicationData />;
  }

  return (
    <MedicationList
      authUser={authUser}
      searchTerm={searchTerm}
      onChange={setSearchTerm}
      meds={medicationList}
    />
  );
};

export default withPrivateRoute(MedicationListPatient);
