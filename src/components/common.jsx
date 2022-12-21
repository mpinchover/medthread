import { useNavigate } from "react-router-dom";
import { useState, useRef, useContext, useEffect } from "react";
import { map } from "@firebase/util";
import { FirebaseContext } from "../firebase/firebase-context";
import { FaPen, FaCheck } from "react-icons/fa";

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
  medValues.dose = e.dose;
  medValues.source = e.source;
  medValues.status = e.status;

  if (!medValues.dose) medValues.dose = "UNKNOWN";
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
export const TextInputWithEdit = ({
  label,
  placeholder,
  name,
  type,
  value,
  onChange,
  onSave,
}) => {
  const [status, setStatus] = useState("IDLE");

  const handleClick = (e) => {
    setStatus("SAVING");
    onSave(e);
  };
  return (
    <div className="relative mb-4 last:mb-0 w-96">
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full pt-7 pb-2 pl-4 pr-16  border rounded-md"
        placeholder="Enter medication name"
      />
      {status === "IDLE" ? (
        <button
          onClick={handleClick}
          className="absolute  top-1/2 -translate-y-1/2  right-5 bg-gray-100 rounded-sm p-2"
        >
          <FaPen />
        </button>
      ) : status === "EDIT" ? (
        <button
          onClick={handleClick}
          className="absolute  top-1/2 -translate-y-1/2  right-5 bg-gray-100 rounded-sm p-2"
        >
          <FaCheck />
        </button>
      ) : (
        <button
          disabled
          className="absolute  top-1/2 -translate-y-1/2  right-5 bg-gray-100 rounded-sm p-2"
        >
          <div className="animate-spin ">
            <div className=" rounded-full border border-black border-t-0 w-4 h-4"></div>
          </div>
        </button>
      )}

      <label className="text-xs font-bold absolute left-4 top-3 ">
        {label}
      </label>
    </div>
  );
};

export const TextInput = ({
  label,
  placeholder,
  name,
  type,
  value,
  onChange,
  info,
  disabled,
}) => {
  return (
    <div className="relative  w-96">
      <input
        type={type}
        disabled={disabled}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full pt-7 pb-2 px-4 border rounded-md"
        placeholder={placeholder}
      />
      <label className="text-xs font-bold absolute left-4 top-3 ">
        {label}
      </label>
      {info ? <div className="text-xs font-semibold mt-2">{info}</div> : null}
    </div>
  );
};

export const DatePicker = ({
  label,
  placeholder,
  name,
  type,
  value,
  onChange,
}) => {
  return (
    <div className="relative mb-2 last:mb-0">
      <input
        name={name}
        value={value}
        onChange={onChange}
        type="date"
        className="w-full pt-7 pb-2 px-4 border rounded-md"
        placeholder="Enter medication name"
      />
      <label className="text-xs font-bold absolute left-4 top-3 ">
        {label}
      </label>
    </div>
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
      } absolute top-full w-72 bg-white shadow-md flex-col right-0 `}
    >
      {options.map((e, i) => {
        if (e.link) {
          return (
            <li
              key={i}
              className="border border-t-0 last:border-b-0 hover:opacity-50"
            >
              <div className="text-left w-full p-6 flex flex-row items-center">
                {e.icon ? <div className="mr-2">{<e.icon />}</div> : null}
                <a href={e.link}>{e.display}</a>
              </div>
            </li>
          );
        }
        return (
          <li
            key={i}
            className="border border-t-0 last:border-b-0 hover:opacity-50"
          >
            <button
              className="text-left w-full p-6"
              name={e.name}
              onClick={handleClick}
            >
              <div className="flex flex-row items-center">
                {e.icon ? <div className="mr-2">{<e.icon />}</div> : null}
                <div>{e.display}</div>
              </div>
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
        <div className=" rounded-full border border-black border-t-0 w-4 h-4"></div>
      </div>

      <span>Loading medication list...</span>
    </div>
  );
};

export const LoadingSettingsData = () => {
  return (
    <div className="px-28 flex-1 flex items-center justify-center">
      <div className="animate-spin mr-2">
        <div className=" rounded-full border border-black border-t-0 w-4 h-4"></div>
      </div>

      <span>Loading account settings...</span>
    </div>
  );
};

export const LoadingWindow = ({ display }) => {
  return (
    <div className="px-28 flex-1 flex items-center justify-center">
      <div className="animate-spin mr-2">
        <div className=" rounded-full border border-black border-t-0 w-4 h-4"></div>
      </div>

      <span>{display}</span>
    </div>
  );
};
