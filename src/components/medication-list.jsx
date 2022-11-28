import { useEffect, useState } from "react";
import { medicationsCallback } from "../recoil/medications/medications";
import { useRecoilCallback, useSetRecoilState } from "recoil";
import { withPrivateRoute } from "./hocs";
import { AiOutlinePlus } from "react-icons/ai";
import { getAuth } from "firebase/auth";
import { Medication, MedHeader } from "./common";
import { useNavigate } from "react-router-dom";
const MedicationList = ({ meds, onChange, searchTerm, authUser }) => {
  const { role, account } = authUser;
  const { displayName } = account;

  const handleChange = (e) => {
    const { value } = e.target;
    onChange(value);
  };

  const renderMedicationList = () => {
    return (
      <ul>
        {meds.map((e, i) => {
          return (
            <li key={i}>
              <Medication e={e} />
            </li>
          );
        })}
      </ul>
    );
  };

  const navigate = useNavigate();

  return (
    <div className="flex-1 px-2 md:px-28 py-2 md:py-10 bg-gray-100 ">
      <section className="bg-white border p-4 md:px-10 md:py-7 rounded-sm">
        <section className="mb-4">
          <MedHeader
            value={searchTerm}
            onChange={handleChange}
            name={displayName}
          />
        </section>
        {role === "PATIENT" ? (
          <button
            onClick={() => navigate(`/add-medication`)}
            className=" mb-8 flex flex-row items-center  text-blue-400 "
          >
            <AiOutlinePlus size={18} />
            <span className="ml-1">Add medication </span>
          </button>
        ) : null}

        {renderMedicationList()}
      </section>
    </div>
  );
};

export default withPrivateRoute(MedicationList);
