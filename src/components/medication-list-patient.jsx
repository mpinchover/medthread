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
  getMedicationsForPatientCallback,
} from "../recoil/medications/medications";

import { getAuth } from "firebase/auth";
import { LoadingMedicationData } from "./common";
import { FirebaseContext } from "../firebase/firebase-context";
import { withPrivateRoute } from "./hocs";

const MedicationListPatient = () => {
  const { getAuthUser } = useContext(FirebaseContext);
  const authUser = getAuthUser();

  const getMedications = useRecoilCallback(getMedicationsForPatientCallback);

  const [medicationlist, setMedicationlist] = useRecoilState(
    derivedMedicationsState
  );

  useEffect(() => {
    getMedications();
  }, []);

  const isLoadingMedicationList = useRecoilValue(
    loadingDerivedMedicationlistState
  );

  if (isLoadingMedicationList) {
    return <LoadingMedicationData />;
  }

  return <MedicationList meds={medicationlist} />;
};

export default withPrivateRoute(MedicationListPatient);
