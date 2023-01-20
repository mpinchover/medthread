import {
  isGettingHealthcareProviderPatientsState,
  getPatientsByHealthcareProviderUidCallback,
  healthcareProviderPatientsState,
} from "../recoil/provider/provider";
import { useRecoilValue, useRecoilCallback, useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { withPrivateRoute } from "./hocs";

const PatientItem = ({ patient }) => {
  const navigate = useNavigate();
  const link = `/records/${patient.userUid}`;

  return (
    <button
      onClick={() => navigate(link)}
      className="text-xs border-b last:border-b-0 py-8 w-full rounded-sm flex flex-row justify-between "
    >
      <div>{patient?.account?.nameValue}</div>
      <div>Request reauthentication</div>
    </button>
  );
};

const ListOfPatients = ({ healthcareProviderPatients }) => {
  useEffect(() => {}, []);
  console.log("PATIENTS ");
  console.log(healthcareProviderPatients);
  return (
    <div className="px-2 md:px-28">
      <div className="py-8">
        {healthcareProviderPatients?.map((e, i) => {
          return <PatientItem patient={e} key={i} />;
        })}
      </div>
    </div>
  );
};

const CareProviderPatients = () => {
  const getPatientsByHealthcareProviderUid = useRecoilCallback(
    getPatientsByHealthcareProviderUidCallback
  );
  const healthcareProviderPatients = useRecoilValue(
    healthcareProviderPatientsState
  );
  const isGettingHealthcareProviderPatients = useRecoilValue(
    isGettingHealthcareProviderPatientsState
  );

  // const [searchQuery, setSearchQuery] = useRecoilState(
  //   previousPatientsSearchTermState
  // );

  useEffect(() => {
    getPatientsByHealthcareProviderUid();
  }, []);

  const handleChange = (e) => {
    const { value } = e.target;
    // setSearchQuery(value);
  };

  return (
    <ListOfPatients healthcareProviderPatients={healthcareProviderPatients} />
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
