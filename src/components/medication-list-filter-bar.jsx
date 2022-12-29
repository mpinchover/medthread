import { useState } from "react";
import { useRecoilState } from "recoil";
import { TbPill } from "react-icons/tb";
import {
  FaPen,
  FaSyringe,
  FaDiagnoses,
  FaProcedures,
  FaAllergies,
} from "react-icons/fa";
import {
  recordsActiveCategoryState,
  recordsSearchQueryState,
} from "../recoil/claims/claims";

const FilterButton = ({ Icon, title, active, name, onClick }) => {
  return (
    <button
      onClick={onClick}
      name={name}
      className={`flex pb-4 flex-col items-center justify-center border-b-2  ${
        active === name
          ? "text-black  border-black"
          : "text-gray-400 border-transparent"
      }`}
    >
      <Icon size={28} />
      <span className="text-xs mt-2 font-semibold">{title}</span>
    </button>
  );
};

const MedicationListFilterBar = () => {
  const [searchQuery, setSearchQuery] = useRecoilState(recordsSearchQueryState);
  const [recordsActiveCategory, setRecordsActiveCategory] = useRecoilState(
    recordsActiveCategoryState
  );
  const handleClick = (e) => {
    const name = e.currentTarget.name;
    setSearchQuery("");

    setRecordsActiveCategory(name);
  };
  return (
    <div className=" md:px-28 flex flex-row justify-between ">
      <FilterButton
        name="MEDICATIONS"
        title="Medications"
        Icon={TbPill}
        active={recordsActiveCategory}
        onClick={handleClick}
      />

      <FilterButton
        name="IMMUNIZATIONS"
        title="Immunizations"
        Icon={FaSyringe}
        active={recordsActiveCategory}
        onClick={handleClick}
      />

      <FilterButton
        name="PROCEDURES"
        title="Procedures"
        Icon={FaProcedures}
        active={recordsActiveCategory}
        onClick={handleClick}
      />

      <FilterButton
        name="CONDITIONS"
        title="Conditions"
        Icon={FaDiagnoses}
        active={recordsActiveCategory}
        onClick={handleClick}
      />

      <FilterButton
        name="ALLERGIES"
        title="Allergies"
        Icon={FaAllergies}
        onClick={handleClick}
        active={recordsActiveCategory}
      />
    </div>
  );
};

export default MedicationListFilterBar;
