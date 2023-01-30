import {
  isGettingHealthcareProviderPatientsState,
  getPatientsByHealthcareProviderUidCallback,
  healthcareProviderPatientsState,
} from "../recoil/provider/provider";
import { useRecoilValue, useRecoilCallback, useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { withPrivateRoute } from "./hocs";
import { activeCareProviderPatientState } from "../recoil/provider/provider";
import { LoadingWindow, SearchBar } from "./common";
import { Button } from "./common";
import { modalState } from "../recoil/utils/utils";
import { FaRegCopy } from "react-icons/fa";
import { authorizedProfileState } from "../recoil/auth/auth";
import Fade from "@mui/material/Fade";

const PatientItem = ({ patient, setActiveCareProviderPatient }) => {
  const navigate = useNavigate();
  const link = `/records/${patient.userUid}`;

  const handleClick = () => {
    setActiveCareProviderPatient(patient);
    navigate(link);
  };
  return (
    <button
      onClick={handleClick}
      className="text-sm border-b last:border-b-0 py-8 w-full rounded-sm flex flex-row justify-between "
    >
      <div>{patient?.account?.nameValue}</div>
    </button>
  );
};

const ListOfPatients = ({
  healthcareProviderPatients,
  setActiveCareProviderPatient,
}) => {
  useEffect(() => {}, []);

  return (
    <div className="px-2 md:px-28">
      <div className="">
        {healthcareProviderPatients?.map((e, i) => {
          return (
            <PatientItem
              setActiveCareProviderPatient={setActiveCareProviderPatient}
              patient={e}
              key={i}
            />
          );
        })}
      </div>
    </div>
  );
};

// https://mui.com/material-ui/transitions/
const PatientListHeader = ({ onChange, authorizedProfile, searchQuery }) => {
  const [showCopyPopup, setShowCopyPopup] = useState(false);

  let baseUrl = "";
  if (process.env.REACT_APP_MEDTHREAD_ENV === "PRODUCTION") {
    baseUrl = "https://usemedthread.com";
  } else if (process.env.REACT_APP_MEDTHREAD_ENV === "STAGING") {
    baseUrl = "https://staging.usemedthread.com";
  } else if (process.env.REACT_APP_MEDTHREAD_ENV === "DEMO") {
    baseUrl = "https://demo.usemedthread.com";
  } else {
    baseUrl = "http://localhost:3000";
  }

  const handleCopyNewPatientLink = () => {
    setShowCopyPopup(true);
    setTimeout(() => setShowCopyPopup(false), 1000);
    navigator.clipboard.writeText(
      `${baseUrl}/patient-signup?providerUid=${authorizedProfile.uid}`
    );
  };

  return (
    <section className="px-2 md:px-28 flex flex-row">
      <SearchBar
        value={searchQuery}
        onChange={onChange}
        placeholder="Search patients..."
      />
      <div className="ml-6 relative flex items-center">
        <Fade in={showCopyPopup}>
          <div className="absolute text-sm w-full p-4 bg-white border rounded-sm text-center z-30 bottom-full">
            Copied new patient link
          </div>
        </Fade>
        <Button
          Icon={FaRegCopy}
          onClick={handleCopyNewPatientLink}
          display={"New patient link"}
        />
      </div>
    </section>
  );
};

const CareProviderPatients = ({
  healthcareProviderPatients,
  setActiveCareProviderPatient,
  authorizedProfile,
}) => {
  const [listOfPatients, setListOfPatients] = useState(
    healthcareProviderPatients
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setListOfPatients(healthcareProviderPatients);
  }, [healthcareProviderPatients]);

  const onChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setListOfPatients(() =>
      healthcareProviderPatients.filter((x) =>
        x?.account?.nameValue?.toLowerCase()?.includes(value.toLowerCase())
      )
    );
  };

  return (
    <div className="py-8">
      <PatientListHeader
        onChange={onChange}
        searchQuery={searchQuery}
        authorizedProfile={authorizedProfile}
      />
      <ListOfPatients
        setActiveCareProviderPatient={setActiveCareProviderPatient}
        healthcareProviderPatients={listOfPatients}
      />
    </div>
  );
};

const CareProviderPatientsContainer = () => {
  const healthcareProviderPatients = useRecoilValue(
    healthcareProviderPatientsState
  );
  const [activeCareProviderPatient, setActiveCareProviderPatient] =
    useRecoilState(activeCareProviderPatientState);
  const getPatientsByHealthcareProviderUid = useRecoilCallback(
    getPatientsByHealthcareProviderUidCallback
  );
  const isGettingHealthcareProviderPatients = useRecoilValue(
    isGettingHealthcareProviderPatientsState
  );
  const authorizedProfile = useRecoilValue(authorizedProfileState);

  useEffect(() => {
    setActiveCareProviderPatient(null);
    getPatientsByHealthcareProviderUid();
  }, []);

  if (isGettingHealthcareProviderPatients) {
    return <LoadingWindow display="Getting patients..." />;
  }

  return (
    <CareProviderPatients
      authorizedProfile={authorizedProfile}
      setActiveCareProviderPatient={setActiveCareProviderPatient}
      healthcareProviderPatients={healthcareProviderPatients}
    />
  );
};

export default withPrivateRoute(CareProviderPatientsContainer);
