import { useEffect, useState } from "react";
import { medicationsCallback } from "../recoil/medications/medications";
import { useRecoilCallback, useSetRecoilState } from "recoil";
import { withPrivateRoute } from "./hocs";
import { AiOutlinePlus } from "react-icons/ai";
import { getAuth } from "firebase/auth";
import { Medication, MedHeader } from "./common";
import { useNavigate } from "react-router-dom";
const MedicationList = ({ meds, onChange, searchTerm }) => {
  // const [searchQuery, setSearchQuery] = useState("");
  // const [medications, setMedications] = useState(meds);

  const handleChange = (e) => {
    const { value } = e.target;
    onChange(value);

    // setMedications(filteredMeds);
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
    <div className="flex-1 px-28 py-10 bg-gray-100 ">
      <section className="bg-white border px-10 py-7 rounded-sm">
        <section className="mb-4">
          <MedHeader
            value={searchTerm}
            onChange={handleChange}
            name={"Matt Pennywheel"}
          />
        </section>
        <button
          onClick={() => navigate(`/add-medication`)}
          className=" mb-8 flex flex-row items-center  text-blue-400 "
        >
          <AiOutlinePlus size={18} />
          <span className="ml-1">Add medication </span>
        </button>

        {renderMedicationList()}
      </section>
    </div>
  );
};

export default withPrivateRoute(MedicationList);
