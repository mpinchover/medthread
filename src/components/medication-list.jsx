import { useEffect, useState, useRef } from "react";
import { medicationsCallback } from "../recoil/medications/medications";
import {
  useRecoilCallback,
  useSetRecoilState,
  useRecoilValue,
  useRecoilState,
} from "recoil";
import { withPrivateRoute } from "./hocs";
import {
  AiOutlinePlus,
  AiFillRightCircle,
  AiFillEdit,
  AiFillWarning,
} from "react-icons/ai";
import { RiErrorWarningFill } from "react-icons/ri";
import {
  FaPen,
  FaSyringe,
  FaDiagnoses,
  FaProcedures,
  FaAllergies,
} from "react-icons/fa";
import { TbPill } from "react-icons/tb";
import { BsArrowRightCircle } from "react-icons/bs";
import { getAuth } from "firebase/auth";
import { IoIosOptions } from "react-icons/io";
import {
  Medication,
  MedHeader,
  HeadlessDropdown,
  Med,
  FilterItem,
  Immunization,
  Procedure,
  Diagnosis,
  Allergy,
} from "./common";
import { useNavigate } from "react-router-dom";
import AddMedicationModal from "./medication-modal-add";
import UpdateMedicationModal from "./medication-modal-update";
import {
  healthRecordsState,
  healthRecordsCategoriesState,
  filteredHealthRecordsState,
  healthRecordsSearchTermState,
} from "../recoil/records/records";
import CareGapsModal from "./medication-list-modal-care-gaps";

// const style = {
//   background: `gradient(
//   center bottom,
//   rgba(0,0,0,1.0) 0%,
//   rgba(0,0,0,0.0) 100%
// )`,
// };

const style = {
  backgroundImage: `rgba(0,0,0,0.0)`,
  opacity: 1,
};

const navbarDropdownMenuOptions = [
  { name: "MED", display: "Medication" },
  { name: "PROCEDURE", display: "Procedure" },
  { name: "DIAGNOSIS", display: "Diagnosis" },
  { name: "IMMUNIZATION", display: "Immunization" },
  { name: "ALLERGY", display: "Allergy" },
];

const MedicationList = ({
  // meds,
  onChange,
  // searchTerm,
  authUser,
  activePatient,
}) => {
  const mainDropdownRefBtn = useRef(null);
  const { role, account } = authUser;
  const { displayName } = account;
  const [medToBeUpdated, setMedToBeUpdated] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCareGapsModalOpen, setIsCareGapsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useRecoilState(
    healthRecordsSearchTermState
  );
  const items = useRecoilValue(filteredHealthRecordsState);
  const [filteredCategories, setFilteredCategories] = useRecoilState(
    healthRecordsCategoriesState
  );

  const handleUpdateMedication = (e) => {
    setMedToBeUpdated(e);
    setIsOpen(true);
  };

  const renderList = () => {
    return (
      <ul className="grid grid-cols-2  gap-10">
        {items.map((e, i) => {
          if (e.itemType === "ALLERGIES") {
            return (
              <li key={i}>
                <Allergy role={role} e={e} />
              </li>
            );
          }
          if (e.itemType === "PROCEDURES") {
            return (
              <li key={i}>
                <Procedure role={role} e={e} />
              </li>
            );
          }
          if (e.itemType === "DIAGNOSES") {
            return (
              <li key={i}>
                <Diagnosis role={role} e={e} />
              </li>
            );
          }
          if (e.itemType === "IMMUNIZATIONS") {
            return (
              <li key={i}>
                <Immunization role={role} e={e} />
              </li>
            );
          }
          return (
            <li key={i}>
              <Med
                handleUpdateMedication={handleUpdateMedication}
                medValues={e}
                role={role}
              />
            </li>
          );
        })}
      </ul>
    );
  };

  const navigate = useNavigate();

  const onSave = () => {
    setMedToBeUpdated(null);
    setIsOpen(false);

    // check if the uid exists and save
    if (medToBeUpdated) {
      // if ()
    }
  };

  /*
     style={{
        background: `rgba(0, 0, 0, 0.5)`,
      }}
       */

  let style = {};
  if (isOpen || isCareGapsModalOpen) {
    style = {
      background: "rgba(0, 0, 0, 0.5)",
    };
  }

  const onDropdownClick = (e) => {
    const name = e.target.name;
    setIsOpen(true);
    if (name === "PROVIDER_LOGIN") navigate("/provider-login");
    if (name === "PATIENT_LOGIN") navigate("/patient-login");
  };

  const handleToggleOpen = (e) => {
    e.preventDefault();
    setIsMenuOpen(!isMenuOpen);
    setMedToBeUpdated(null);
  };

  const handleModalClose = () => {
    setMedToBeUpdated(null);
    setIsOpen(false);
  };

  const handleFilterClick = (e) => {
    const name = e.currentTarget.name;

    // remove it
    if (filteredCategories.includes(name)) {
      const newFilteredCategories = filteredCategories.filter(
        (x) => x !== name
      );
      setFilteredCategories(newFilteredCategories);
    } else {
      setFilteredCategories([...filteredCategories, name]);
    }
  };

  const handleCloseGapsModal = () => {
    setIsCareGapsModalOpen(false);
  };

  return (
    <div className="flex-1 relative ">
      <div
        style={style}
        className={`${
          isOpen || isCareGapsModalOpen ? "absolute" : "hidden "
        } h-full w-full z-20`}
      ></div>
      <div className="flex-1 relative">
        <div>
          <div className="py-4  px-2 md:px-28 flex flex-row relative items-center">
            <RiErrorWarningFill color="orange" size={16} />
            <button
              onClick={() => setIsCareGapsModalOpen(true)}
              className="ml-2 text-sm text-blue-400"
            >
              View care gaps
            </button>
          </div>
          <div className="py-4  px-2 md:px-28 flex flex-row relative">
            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              className=" focus:outline-none p-4 text-sm border rounded-full flex-1 "
              placeholder="Search medications, procedures..."
            />
            <div className="flex flex-row ml-6">
              <button
                // onClick={handleToggleOpen}
                // ref={mainDropdownRefBtn}
                className="k flex flex-row border rounded-full py-4 px-6 items-center"
              >
                <IoIosOptions size={20} />
                <span className="text-xs ml-1">Filters</span>
              </button>
            </div>
          </div>
          <div className="py-4 flex flex-row px-2 md:px-28 shadow-sm items-center  w-full">
            <div className="flex flex-row flex-1 relative justify-between">
              {/* <ul className="flex flex-row  relative overflow-x-scroll whitespace-nowrap flex-1 justify-between mr-20"> */}
              <FilterItem
                active={filteredCategories.includes("MEDICATIONS")}
                handleClick={handleFilterClick}
                name={"MEDICATIONS"}
                icon={<TbPill size={28} />}
                label="Medications"
              />
              <FilterItem
                active={filteredCategories.includes("IMMUNIZATIONS")}
                handleClick={handleFilterClick}
                name={"IMMUNIZATIONS"}
                icon={<FaSyringe size={28} />}
                label="Immunizations"
              />
              <FilterItem
                active={filteredCategories.includes("DIAGNOSES")}
                handleClick={handleFilterClick}
                name={"DIAGNOSES"}
                icon={<FaDiagnoses size={28} />}
                label="Diagnoses"
              />
              <FilterItem
                active={filteredCategories.includes("PROCEDURES")}
                handleClick={handleFilterClick}
                name={"PROCEDURES"}
                icon={<FaProcedures size={28} />}
                label="Procedures"
              />

              <FilterItem
                active={filteredCategories.includes("ALLERGIES")}
                handleClick={handleFilterClick}
                name={"ALLERGIES"}
                icon={<FaAllergies size={28} />}
                label="Allergies"
              />

              {/* <FilterItem icon={TbPill} label="Diagnoses" />
              <FilterItem icon={TbPill} label="Procedures" />

              <FilterItem icon={TbPill} label="Allergies" />
              <FilterItem icon={TbPill} label="Immunizations" /> */}
              {/* </ul> */}
              {role === "PATIENT" ? (
                <div className="relative z-10">
                  <button
                    onClick={handleToggleOpen}
                    ref={mainDropdownRefBtn}
                    className="ml-2 text-white bg-black flex flex-row border rounded-full py-4 px-6 items-center"
                  >
                    <AiOutlinePlus size={20} />
                    <span className="text-xs ml-1">Add item</span>
                  </button>

                  <HeadlessDropdown
                    options={navbarDropdownMenuOptions}
                    isOpen={isMenuOpen}
                    onClick={onDropdownClick}
                    toggleOpen={setIsMenuOpen}
                    mainDropdownRefBtn={mainDropdownRefBtn}
                  />
                </div>
              ) : null}
            </div>

            {/* <div className="w-10 ml-10 z-10 flex items-center justify-center ">
            <BsArrowRightCircle size={20} />
          </div> */}
          </div>
          <div className="py-10 px-2 md:px-28 ">{renderList()}</div>
          <AddMedicationModal
            medToBeUpdated={medToBeUpdated}
            isOpen={isOpen}
            onSave={onSave}
            onClose={handleModalClose}
          />
          <CareGapsModal
            isOpen={isCareGapsModalOpen}
            onClose={handleCloseGapsModal}
          />
        </div>
      </div>
    </div>
  );
};

export default withPrivateRoute(MedicationList);

/*
 backgroundImage:
    "linear-gradient(to right,rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.1) 100%)",
     */
