import { useEffect, useContext } from "react";
import {
  derivedMedicationsState,
  getMedicationsForProviderCallback,
  filteredDerivedMedicationsState,
  medicationSearchTermState,
} from "../recoil/medications/medications";
import { useRecoilCallback, useRecoilState } from "recoil";
import { withPrivateRoute } from "./hocs";
import { AiOutlinePlus } from "react-icons/ai";
import { getAuth } from "firebase/auth";
import { Medication, MedHeader } from "./common";
import { useNavigate, useSearchParams } from "react-router-dom";
import MedicationList from "./medication-list";
import { FirebaseContext } from "../firebase/firebase-context";

const ProviderMedList = ({ meds }) => {
  const { getAuthUser } = useContext(FirebaseContext);
  const authUser = getAuthUser();
  const role = authUser.role;
  const [medicationList, setMedicationList] = useRecoilState(
    filteredDerivedMedicationsState
  );
  const [searchTerm, setSearchTerm] = useRecoilState(medicationSearchTermState);
  const [searchParams, setSearchParams] = useSearchParams();

  const patientUid = searchParams.get("patientUid");

  const getMedicationsForProvider = useRecoilCallback(
    getMedicationsForProviderCallback
  );

  useEffect(() => {
    getMedicationsForProvider(patientUid);
  }, []);

  return (
    <MedicationList
      role={role}
      searchTerm={searchTerm}
      onChange={setSearchTerm}
      meds={medicationList}
    />
  );
};

export default withPrivateRoute(ProviderMedList);
