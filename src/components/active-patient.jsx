import { enableIndexedDbPersistence } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { Navigate } from "react-router-dom";
import ActivePatientHeader from "./active-patient-header";
import { useNavigate } from "react-router-dom";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import { patientMedications } from "../recoil/patient/medications";
import { patientProcedures } from "../recoil/patient/procedures";
import { patientImmunizations } from "../recoil/patient/immunizations";
import { patientAllergies } from "../recoil/patient/allergies";
import { patientInformation } from "../recoil/patient/patient-information";
import { PrivateRoute, withPrivateRoute } from "./hocs";
import { getMedicationsByUid } from "../rpc/get-medications-by-patient-uid";
const filters = [
  {
    display: "Medications",
    id: "medications",
  },
  {
    display: "Allergies",
    id: "allergies",
  },
  {
    display: "Procedures",
    id: "procedures",
  },
  {
    display: "Immunizations",
    id: "immunizations",
  },
  {
    display: "Patient Information",
    id: "patient_information",
  },
];

const ActivePatient = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [activeFilter, setActiveFilter] = useState("medications");
  const [patientName, setPatientName] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [medications, setMedications] = useRecoilState(patientMedications);
  const [allergies, setAllergies] = useRecoilState(patientAllergies);
  const [immunizations, setImmunizations] =
    useRecoilState(patientImmunizations);
  const [patientInfo, setPatientInfo] = useRecoilState(patientInformation);
  const [procedures, setProcedures] = useRecoilState(patientProcedures);
  const navigate = useNavigate();

  useEffect(() => {});

  const onChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const renderFeed = (dataset) => {
    if (activeFilter === "patient_information") {
      return (
        <div className="text-lg flex flex-row">
          <section className="w-60">
            <div className="font-bold mb-2">Personal information</div>
            <div>{dataset.name}</div>
            <div>{dataset.phone}</div>
            <div>{dataset.email}</div>
          </section>
          <section className="w-60">
            <div className="font-bold  mb-2">Data sources:</div>
            <div>United Healthcare</div>
            <div>Humana</div>
          </section>
          <section className="w-60">
            <div className="font-bold  mb-2">Address</div>
            <div>{dataset.streetAddress}</div>
            <div>{dataset.city}</div>
            <div>{dataset.district}</div>
            <div>
              {dataset.state + " " + dataset.postal + " " + dataset.country}
            </div>
          </section>
        </div>
      );
    }
    const filteredDataset = dataset.filter((item) => {
      return item.header.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return filteredDataset.map((e, i) => {
      return (
        <li key={i} className="mb-4">
          <button
            id={e.id}
            onClick={() => handleActiveTab(e.id)}
            className="flex-row flex items-center justify-between bg-gray-100 w-full py-4 px-2 cursor-pointer "
          >
            <div className="flex-row flex items-center">
              {activeTab === e.id ? (
                <AiOutlineMinus className="" style={{ fontSize: 26 }} />
              ) : (
                <AiOutlinePlus className="" style={{ fontSize: 26 }} />
              )}

              <div className="ml-2 items-start flex flex-col ">
                <h2 className="text-lg">{e.header}</h2>
                <div className="text-sm">{e.date}</div>
              </div>
            </div>
          </button>
          <div
            className={` ${
              activeTab === e.id ? "block" : "hidden"
            } border-gray-100 border-2 py-3 px-2`}
          >
            <div>{e.dose ? e.dose : null}</div>
            <div>{e.agent ? e.agent : null}</div>
            <div>{e.reaction ? "Reaction: " + e.reaction : null}</div>
            <div>{e.procedure ? e.procedure : null}</div>
            <div>{e.immunization ? e.immunization : null}</div>
            <div>{e.provider ? e.provider : null}</div>
          </div>
        </li>
      );
    });
  };

  const datasetMap = {
    medications: medications,
    allergies: allergies,
    procedures,
    immunizations,
    patient_information: patientInfo,
  };

  const handleActiveTab = (id) => {
    if (activeTab === id) setActiveTab(null);
    else setActiveTab(id);
  };

  const handleFilterTab = (id) => {
    if (activeFilter === id) return;
    setSearchTerm("");
    setActiveFilter(id);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="px-28 py-6">
        <ActivePatientHeader />
      </div>
      <div className="px-28 flex flex-row ">
        <ul>
          {filters.map((e, i) => {
            return (
              <li
                onClick={() => handleFilterTab(e.id)}
                key={i}
                id={e.id}
                className={`${
                  activeFilter === e.id ? "border-gray-500" : " text-gray-400"
                } hover:opacity-50 cursor-pointer py-2 border-b text-lg`}
              >
                {e.display}
              </li>
            );
          })}
        </ul>

        <ul className="ml-4 flex-1">
          <div
            className={`border-b mb-${
              activeFilter === "patient_information" ? 2 : 4
            } `}
          >
            {activeFilter === "patient_information" ? (
              <div className=" text-lg w-full py-2 ">Patient information</div>
            ) : (
              <input
                onChange={onChange}
                value={searchTerm}
                className="focus:outline-none text-lg w-full py-2 "
                placeholder={`Search ${activeFilter}...`}
              ></input>
            )}
          </div>
          {datasetMap[activeFilter] && renderFeed(datasetMap[activeFilter])}
        </ul>
      </div>
    </div>
  );
};

export default withPrivateRoute(ActivePatient);
