import { useNavigate } from "react-router-dom";
import { useState, useRef, useContext, useEffect } from "react";
import { map } from "@firebase/util";
import { FirebaseContext } from "../firebase/firebase-context";

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

  const authUser = getAuthUser();
  const role = authUser.role;

  medValues.medicationName = e.medicationName;
  medValues.dateStarted = e.dateStarted;
  medValues.prescribedBy = e.prescribedBy;
  medValues.medicationType = e.medicationType;

  let dose = e.medicationDoseValue + " " + e.medicationDoseUnit;
  if (!e.medicationDoseValue && !e.medicationDoseUnit) dose = "UNKNOWN";
  medValues.dose = dose;
  medValues.source = e.source;
  medValues.status = e.status;

  if (!medValues.medicationName) medValues.medicationName = "UNKNOWN";
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
        <div className="text-xl max-w-2xl">{medValues.medicationName}</div>
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
        <DisplayField label={"Source"} display={medValues.source} />
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
