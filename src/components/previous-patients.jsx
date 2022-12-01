import {
  getPreviousPatientsCallback,
  isGettingPreviousPatientsState,
  previousPatientsState,
  filteredPreviousPatientsState,
  previousPatientsSearchTermState,
  activePatientState,
} from "../recoil/provider/provider";
import { useRecoilValue, useRecoilCallback, useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { withPrivateRoute } from "./hocs";

const PatientItem = ({ patient }) => {
  const navigate = useNavigate();
  const link = `/medication-list-provider/?patientUid=${patient.userUid}`;

  return (
    <button
      onClick={() => navigate(link)}
      className="border p-4 w-full rounded-sm flex flex-row justify-between hover:shadow-sm"
    >
      <div>{patient?.account?.displayName}</div>
      <div>10/20/2022</div>
    </button>
  );
};

const PreviousPatients = () => {
  const getPreviousPatients = useRecoilCallback(getPreviousPatientsCallback);
  const isGettingPreviousPatients = useRecoilValue(
    isGettingPreviousPatientsState
  );
  const previousPatients = useRecoilValue(previousPatientsState);
  const filteredPreviousPatients = useRecoilValue(
    filteredPreviousPatientsState
  );

  const [searchQuery, setSearchQuery] = useRecoilState(
    previousPatientsSearchTermState
  );



  useEffect(() => {
    getPreviousPatients();
  }, []);

  const handleChange = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
  };

  if (filteredPreviousPatients)
    return (
      <div className="flex-1 p-2 md:px-28 md:py-10 bg-gray-100 ">
        <div className="bg-white border p-4 md:px-10 md:py-7 rounded-sm">
          <div className="mb-4">
            <section className="text-xl mb-4">{"Previous patients"}</section>
            <input
              value={searchQuery}
              onChange={handleChange}
              className="w-full p-4  focus:outline-none border rounded-sm"
              placeholder="Search patients..."
            />
          </div>
          <ul>
            {filteredPreviousPatients.map((e, i) => {
              return (
                <li key={i} className="mb-4 last:mb-0">
                  <PatientItem patient={e} />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
};

export default withPrivateRoute(PreviousPatients);
