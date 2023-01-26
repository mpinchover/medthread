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
const PatientListHeader = ({ handleAddPatient, authorizedProfile }) => {
  const [showCopyPopup, setShowCopyPopup] = useState(false);

  const handleCopyNewPatientLink = () => {
    setShowCopyPopup(true);
    setTimeout(() => setShowCopyPopup(false), 1000);
    navigator.clipboard.writeText(
      `${process.env.REACT_APP_BASE_URL}/patient-signup?providerUid=${authorizedProfile.uid}`
    );
  };

  return (
    <section className="px-2 md:px-28 flex flex-row">
      <SearchBar placeholder="Search patients..." />
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

const CareProviderPatients = () => {
  const getPatientsByHealthcareProviderUid = useRecoilCallback(
    getPatientsByHealthcareProviderUidCallback
  );
  const healthcareProviderPatients = useRecoilValue(
    healthcareProviderPatientsState
  );
  const [authorizedProfile, setAuthorizedProfile] = useRecoilState(
    authorizedProfileState
  );

  const isGettingHealthcareProviderPatients = useRecoilValue(
    isGettingHealthcareProviderPatientsState
  );
  const [modal, setModal] = useRecoilState(modalState);
  const [activeCareProviderPatient, setActiveCareProviderPatient] =
    useRecoilState(activeCareProviderPatientState);

  // const [searchQuery, setSearchQuery] = useRecoilState(
  //   previousPatientsSearchTermState
  // );

  useEffect(() => {
    setActiveCareProviderPatient(null);
    getPatientsByHealthcareProviderUid();
  }, []);

  const handleChange = (e) => {
    const { value } = e.target;
    // setSearchQuery(value);
  };

  const handleAddPatient = () => {
    // setModal((prevState) => {
    //   return {
    //     ...prevState,
    //     isAddingPatient: true,
    //   };
    // });
  };

  if (isGettingHealthcareProviderPatients) {
    return <LoadingWindow display="Getting patients..." />;
  }

  return (
    <div className="py-8">
      <PatientListHeader
        authorizedProfile={authorizedProfile}
        handleAddPatient={handleAddPatient}
      />
      <ListOfPatients
        setActiveCareProviderPatient={setActiveCareProviderPatient}
        healthcareProviderPatients={healthcareProviderPatients}
      />
    </div>
  );

  // if (filteredPreviousPatients)
  //   return (
  //     <div className="flex-1 p-2 md:px-28 md:py-10 bg-gray-100 ">
  //       <div className="bg-white border p-4 md:px-10 md:py-7 rounded-sm">
  //         <div className="mb-4">
  //           <section className="text-xl mb-4">{"Previous patients"}</section>
  //           <input
  //             value={searchQuery}
  //             onChange={handleChange}
  //             className="w-full p-4  focus:outline-none border rounded-sm"
  //             placeholder="Search patients..."
  //           />
  //         </div>
  //         <ul>
  //           {filteredPreviousPatients.map((e, i) => {
  //             return (
  //               <li key={i} className="mb-4 last:mb-0">
  //                 <PatientItem patient={e} />
  //               </li>
  //             );
  //           })}
  //         </ul>
  //       </div>
  //     </div>
  //   );
};

export default withPrivateRoute(CareProviderPatients);
