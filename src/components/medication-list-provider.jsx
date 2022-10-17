import { useEffect } from "react";
import {
  derivedMedicationsState,
  getMedicationsForProviderCallback,
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
    derivedMedicationsState
  );
  const [searchParams, setSearchParams] = useSearchParams();

  const patientUid = searchParams.get("patientUid");

  const getMedicationsForProvider = useRecoilCallback(
    getMedicationsForProviderCallback
  );

  useEffect(() => {
    getMedicationsForProvider(patientUid);
  }, [patientUid]);

  return <MedicationList meds={medicationList} />;
};

export default withPrivateRoute(ProviderMedList);
