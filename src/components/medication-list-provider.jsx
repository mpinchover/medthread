import { useEffect } from "react";
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
const ProviderMedList = ({ meds }) => {
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
      searchTerm={searchTerm}
      onChange={setSearchTerm}
      meds={medicationList}
    />
  );
};

export default withPrivateRoute(ProviderMedList);
