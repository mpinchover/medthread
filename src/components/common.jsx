import { useNavigate } from "react-router-dom";
import { useState, useRef, useContext, useEffect } from "react";
import { map } from "@firebase/util";
import { FirebaseContext } from "../firebase/firebase-context";
import {
  FaPen,
  FaSyringe,
  FaDiagnoses,
  FaProcedures,
  FaAllergies,
} from "react-icons/fa";

const DisplayField = ({ label, display }) => {
  return (
    <div className="mb-1 last:mb-0 flex flex-row ">
      <div className=" ">{label}: </div>
      <div className="ml-2">{display}</div>
    </div>
  );
};
export const Medication = ({ e }) => {
  let medValues = {};
  const { getAuthUser } = useContext(FirebaseContext);

  console.log(e.dose);
  const authUser = getAuthUser();
  const role = authUser.role;

  medValues.itemName = e.itemName;
  medValues.dateStarted = e.dateStarted;
  medValues.prescribedBy = e.prescribedBy;
  medValues.medicationType = e.medicationType;
  medValues.dose = e.dose;
  medValues.source = e.source;
  medValues.status = e.status;

  if (!medValues.dose) medValues.dose = "UNKNOWN";
  if (!medValues.itemName) medValues.itemName = "UNKNOWN";
  if (!medValues.dateStarted) medValues.dateStarted = "UNKNOWN";
  if (!medValues.requesterName) medValues.requesterName = "UNKNOWN";
  if (!medValues.medicationType) medValues.medicationType = "UNKNOWN";
  if (!medValues.medicationDoseUnit) medValues.medicationDoseUnit = "UNKNOWN";
  if (!medValues.medicationDoseValue) medValues.medicationDoseValue = "UNKNOWN";
  if (!medValues.source) medValues.source = "UNKNOWN";
  if (!medValues.status) medValues.status = "UNKNOWN";

  if (
    medValues.medicationDoseValue === "UNKNOWN" &&
    medValues.medicationDoseUnit == "UNKNOWN"
  ) {
    medValues.medicationDoseUnit = "";
  } else if (medValues.medicationDoseValue === "UKNOWN") {
    medValues.medicationDoseValue = "";
  } else if (medValues.medicationDoseUnit === "UKNOWN") {
    medValues.medicationDoseUnit = "";
  }

  const navigate = useNavigate();
  return (
    <div className="shadow-md border mb-6  p-6 relative rounded-sm">
      <section className="mb-4">
        <div className="text-xl max-w-2xl">{medValues.itemName}</div>
      </section>
      <section className="text-gray-900">
        <DisplayField label={"Requested on"} display={medValues.dateStarted} />

        <DisplayField label={"Requested by"} display={medValues.prescribedBy} />
        {/* <DisplayField label={"Intent"} display={e.intent} /> */}

        <DisplayField label={"Type"} display={medValues.medicationType} />

        <DisplayField label={"Dose"} display={medValues.dose} />
        {/* 
        <DisplayField
          label={"Quantity dispensed"}
          display={e.medicationDispensedQuantity}
        /> */}
        {/* <DisplayField label={"Source"} display={medValues.source} /> */}
      </section>
      {role === "PATIENT" ? (
        <section className="mt-2">
          <button
            onClick={() => navigate(`/update-medication?medId=${e.uid}`)}
            className="text-md text-blue-400"
          >
            Update medication
          </button>
        </section>
      ) : null}

      <section
        className={`absolute top-6 right-6 ${
          medValues.status === "ACTIVE" ? "text-green-600" : "text-red-600"
        } `}
      >
        {e.status}
      </section>
    </div>
  );
};

export const TextInput = ({
  value,
  label,
  type,
  id,
  onChange,
  disabled,
  placeholder,
  name,
}) => {
  return (
    <div className="flex flex-col ">
      <label className="text-xs mb-1">{label}</label>

      <input
        disabled={disabled}
        onChange={onChange}
        id={id}
        name={name}
        type={type}
        className="px-2 border  rounded-sm py-2  w-full md:w-96"
        value={value}
        placeholder={placeholder}
      />
    </div>
  );
};

export const DatePicker = ({ label, onChange, name, value, disabled }) => {
  return (
    <div className="w-full md:w-96 flex flex-col ">
      <label className="text-xs mb-1">{label}</label>
      <input
        className="border w-full p-2"
        type="date"
        placeholder="CHOOSE DATE"
        onChange={onChange}
        name={name}
        value={value}
        disabled={disabled}
      />
    </div>
  );
};

const activeColorMap = {
  MEDICATIONS: "text-blue-600",
  IMMUNIZATIONS: "text-purple-600",
  PROCEDURES: "text-orange-600",
  DIAGNOSES: "text-yellow-600",
  ALLERGIES: "text-green-600",
};

export const FilterItem = ({ label, icon, name, handleClick, active }) => {
  return (
    <button
      onClick={handleClick}
      name={name}
      className={`inline-block  last:mr-0 ${
        active ? activeColorMap[name] : "text-gray-400"
      }`}
    >
      <div className="flex flex-col items-center  ">
        {icon}
        <div className="text-xs mt-2">{label}</div>
      </div>
    </button>
  );
};

function getMonthShortName(monthNo) {
  const date = new Date();
  date.setMonth(monthNo);

  return date.toLocaleString("en-US", { month: "short" });
}

const getFormattedDate = (date) => {
  if (!date) return null;
  const dateObj = new Date(date);

  const month = getMonthShortName(dateObj.getMonth());
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();

  const formattedDate = `${month}, ${day}, ${year}`;
  return formattedDate;
};

const bgMedMap = {
  MEDICATIONS: "bg-blue-200",
  IMMUNIZATIONS: "bg-purple-200",
  PROCEDURES: "bg-orange-200",
  DIAGNOSES: "bg-yellow-200",
  ALLERGIES: "bg-green-200",
};

const borderMedMap = {
  MEDICATIONS: "border-blue-200",
  IMMUNIZATIONS: "border-purple-200",
  PROCEDURES: "border-orange-200",
  DIAGNOSES: "border-yellow-200",
  ALLERGIES: "border-green-200",
};

/*
  {
    itemType: "ALLERGIES",
    itemName: "BACTRIM",
    date: "2021-03-06",
    dateStarted: "2021-03-06",
    performer: "DR. JOSEPH THOMAS",
    reaction: "Swelling",
    status:"ACTIVE"
  },
   */

export const Allergy = ({ e, role }) => {
  const {
    itemType,
    date,
    dateStarted,

    status,
    reaction,
    performer,
    source,
    itemName,
  } = e;

  let _status = "Active";
  if (status === "NOT_ACTIVE") _status = "Not active";

  let backgroundColor = `${bgMedMap[itemType]}`;
  let borderColor = `${borderMedMap[itemType]}`;

  const formattedDateStarted = getFormattedDate(date);
  const _dateStarted = getFormattedDate(dateStarted);

  return (
    // <div className="border w-full flex items-center justify-center ">
    <div className={`border ${borderColor} rounded-lg overflow-hidden`}>
      <div className={`flex flex-row justify-between ${backgroundColor} p-6`}>
        <div>{itemName}</div>
        <div>{formattedDateStarted}</div>
      </div>
      <div className="p-6 text-sm grid grid-cols-2 border-b h-32">
        <div className="">
          <div className="mb-1">First recorded on {_dateStarted}</div>
          <div className="mb-1">Manifestation: {reaction}</div>
        </div>
        <div>
          <div className="mb-1">{performer}</div>
          {status === "ACTIVE" ? (
            <div className="text-green-600">Active</div>
          ) : (
            <div className="text-red-600">Not Active</div>
          )}
        </div>
      </div>
      <div className="p-6 ">
        <div className="text-sm font-bold mb-1">{source}</div>
        {role === "PATIENT" ? (
          <button className="text-blue-600 flex flex-row items-center">
            <FaPen size={12} />
            <span className="ml-1 text-sm">Update allergy</span>
          </button>
        ) : null}
      </div>
    </div>
    // </div>
  );
};

export const Procedure = ({ e, role }) => {
  const {
    itemType,
    itemName,
    date,
    source,
    performer,
    status,
    diagnosisSource,
    encounterSummary,
  } = e;

  let backgroundColor = `${bgMedMap[itemType]}`;
  let borderColor = `${borderMedMap[itemType]}`;

  const formattedDateStarted = getFormattedDate(date);

  return (
    <div className={`border ${borderColor} rounded-lg overflow-hidden`}>
      <div className={`flex flex-row justify-between ${backgroundColor} p-6`}>
        <div>{itemName}</div>
        <div>{formattedDateStarted}</div>
      </div>
      <div className="p-6 text-sm  border-b h-32">
        <div className="mb-1">Performed by {performer}</div>
      </div>

      <div className="p-6 ">
        <div className="text-sm font-bold mb-1">{source}</div>
        <button className="text-blue-600 flex flex-row items-center">
          {role === "PATIENT" ? (
            <button className="text-blue-600 flex flex-row items-center">
              <FaPen size={12} />
              <span className="ml-1 text-sm">Update Procedure</span>
            </button>
          ) : null}
        </button>
      </div>
    </div>
  );
};

export const Diagnosis = ({ e, role }) => {
  const {
    itemType,
    itemName,
    date,
    source,
    performer,
    status,
    diagnosisSource,
    encounterSummary,
  } = e;

  let backgroundColor = `${bgMedMap[itemType]}`;
  let borderColor = `${borderMedMap[itemType]}`;

  const formattedDateStarted = getFormattedDate(date);

  return (
    <div className={`border ${borderColor} rounded-lg overflow-hidden`}>
      <div className={`flex flex-row justify-between ${backgroundColor} p-6`}>
        <div>{itemName}</div>
        <div>{formattedDateStarted}</div>
      </div>
      <div className="p-6 text-sm border-b h-32">
        <div className="grid grid-cols-2 mb-1 ">
          <div>Source from {diagnosisSource}</div>
          {/* {status === "ACTIVE" ? (
            <div className="text-green-600">Active</div>
          ) : (
            <div className="text-red-600">Not Active</div>
          )} */}
        </div>
        <div className="mb-1">Summary: {encounterSummary}</div>

        <div className="mb-1">Ordered by {performer}</div>
      </div>

      <div className="p-6 ">
        <div className="text-sm font-bold mb-1">{source}</div>
        {role === "PATIENT" ? (
          <button className="text-blue-600 flex flex-row items-center">
            <FaPen size={12} />
            <span className="ml-1 text-sm">Update Diagnosis</span>
          </button>
        ) : null}
      </div>
    </div>
  );
};

export const Immunization = ({
  medValues,
  handleUpdateMedication,
  e,
  role,
}) => {
  const { itemType, itemName, date, source, status, performer } = e;

  let backgroundColor = `${bgMedMap[itemType]}`;
  let borderColor = `${borderMedMap[itemType]}`;

  const formattedDateStarted = getFormattedDate(date);

  // const onClick = () => {
  //   handleUpdateMedication(medValues);
  // };
  return (
    // <div className="border w-full flex items-center justify-center ">
    <div className={`border ${borderColor} rounded-lg overflow-hidden`}>
      <div className={`flex flex-row justify-between ${backgroundColor} p-6`}>
        <div>{itemName}</div>
        <div>{formattedDateStarted}</div>
      </div>
      <div className="p-6 text-sm  border-b h-32">Performed by {performer}</div>

      <div className="p-6 ">
        <div className="text-sm font-bold mb-1">{source}</div>
        {role === "PATIENT" ? (
          <button className="text-blue-600 flex flex-row items-center">
            <FaPen size={12} />
            <span className="ml-1 text-sm">Update immunization</span>
          </button>
        ) : null}
      </div>
    </div>
    // </div>
  );
};

export const Med = ({ medValues, handleUpdateMedication, role }) => {
  const {
    itemType,
    date,
    medicationType,
    dose,
    quantityDispensed,
    status,
    lastRefil,
    prescribedBy,
    source,
    itemName,
    lastRefill,
  } = medValues;

  let _status = "Active";
  if (status === "NOT_ACTIVE") _status = "Not active";

  let backgroundColor = `${bgMedMap[itemType]}`;
  let borderColor = `${borderMedMap[itemType]}`;

  const formattedDateStarted = getFormattedDate(date);
  const refillDate = getFormattedDate(lastRefill);

  const onClick = () => {
    handleUpdateMedication(medValues);
  };
  return (
    // <div className="border w-full flex items-center justify-center ">
    <div className={`border ${borderColor} rounded-lg overflow-hidden`}>
      <div className={`flex flex-row justify-between ${backgroundColor} p-6`}>
        <div>{itemName}</div>
        <div>{formattedDateStarted}</div>
      </div>
      <div className="p-6 text-sm grid grid-cols-2 border-b h-32">
        <div className="">
          {lastRefill ? (
            <div className="mb-1">Last refill on {refillDate}</div>
          ) : null}
          <div className="mb-1">Dose is {dose}</div>
        </div>
        <div>
          <div className="mb-1">{prescribedBy}</div>
          {status === "ACTIVE" ? (
            <div className="text-green-600">Active</div>
          ) : (
            <div className="text-red-600">Not Active</div>
          )}
        </div>
      </div>
      <div className="p-6 ">
        <div className="text-sm font-bold mb-1">{source}</div>
        {role === "PATIENT" ? (
          <button
            onClick={onClick}
            className="text-blue-600 flex flex-row items-center"
          >
            <FaPen size={12} />
            <span className="ml-1 text-sm">Update medication</span>
          </button>
        ) : null}
      </div>
    </div>
    // </div>
  );
};

export const HeadlessDropdown = ({
  options,
  onClick,
  toggleOpen,
  isOpen,
  mainDropdownRefBtn,
}) => {
  const dropDownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      mainDropdownRefBtn.current &&
      !mainDropdownRefBtn.current.contains(event.target) &&
      dropDownRef.current &&
      !dropDownRef.current.contains(event.target)
    ) {
      toggleOpen(false);
    }
  };

  const handleClick = (e) => {
    toggleOpen(false);
    if (onClick) onClick(e);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <ul
      ref={dropDownRef}
      className={`${
        isOpen ? "flex" : "hidden"
      } absolute top-full shadow-lg mt-2  w-52 bg-white flex-col right-0  `}
    >
      {options.map((e, i) => {
        return (
          <li
            key={i}
            className="p-4 border border-t-0 last:border-b-0 hover:opacity-50"
          >
            <button
              className="text-left w-full text-sm"
              name={e.name}
              onClick={handleClick}
            >
              {e.display}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export const DropDown = ({
  label,
  options,
  onChange,
  value,
  disabled,
  defaultValue,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selection, setSelection] = useState(value || defaultValue);

  const dropDownRef = useRef(null);
  const handleClickOutside = (event) => {
    if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    setIsOpen(false);
    setSelection(e.target.name);
    onChange(e.target.name);
  };
  useEffect(() => {
    if (!selection || selection === "") {
      setSelection("NOT SELECTED");
    }
    document.addEventListener("mousedown", handleClickOutside);

    if (value || value !== "") {
      setSelection(value);
    } else if (!value || value === "") {
      setSelection("NOT SELECTED");
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropDownRef, value]);

  const handleClickTitle = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };
  return (
    <div
      ref={dropDownRef}
      className="flex flex-col  relative w-full md:w-96   "
    >
      <label className="text-xs mb-1">{label}</label>

      <button
        disabled={disabled}
        onClick={handleClickTitle}
        className=" w-full text-left px-2 py-2 border"
      >
        {selection}
      </button>
      <ul
        className={`${
          isOpen ? "block" : "hidden"
        } absolute top-full w-96  bg-white shadow-md `}
      >
        {options.map((e, i) => {
          return (
            <li
              key={i}
              className="p-2 border border-t-0 last:border-b-0 hover:opacity-50"
            >
              <button
                className="text-left w-full"
                name={e}
                onClick={handleClick}
              >
                {e}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const MedHeader = ({ name, onChange, value }) => {
  return (
    <div className="mb-4">
      <section className="text-xl mb-4">{name}</section>
      <input
        value={value}
        onChange={onChange}
        className="w-full p-2  focus:outline-none border rounded-sm"
        placeholder="Search medications..."
      />
    </div>
  );
};

export const LoadingMedicationData = () => {
  return (
    <div className="px-28 flex-1 flex items-center justify-center">
      <div className="animate-spin mr-2">
        <div className=" rounded-full border border-blue-200 border-t-blue-400  w-5 h-5"></div>
      </div>

      <span>Loading medication list...</span>
    </div>
  );
};

export const LoadingSettingsData = () => {
  return (
    <div className="px-28 flex-1 flex items-center justify-center">
      <div className="animate-spin mr-2">
        <div className=" rounded-full border border-blue-200 border-t-blue-400  w-5 h-5"></div>
      </div>

      <span>Loading account settings...</span>
    </div>
  );
};

export const LoadingWindow = ({ display }) => {
  return (
    <div className="px-28 flex-1 flex items-center justify-center">
      <div className="animate-spin mr-2">
        <div className=" rounded-full border border-blue-200 border-t-blue-400  w-5 h-5"></div>
      </div>

      <span>{display}</span>
    </div>
  );
};
