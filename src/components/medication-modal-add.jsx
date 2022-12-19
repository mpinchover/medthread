import React, { useState, useEffect, useRef } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { TextInput, DatePicker } from "./common";

const idleState = {
  medicationName: "",
  prescribedBy: "",
  dose: "",
  dateStarted: "",
  dateStopped: "",
  lastRefill: "",
};

const AddMedicationModal = ({
  isOpen,
  onSave,
  onClose,
  medToBeUpdated,
  onRemoveMedication,
}) => {
  const [medAttrs, setMedAttrs] = useState(idleState);

  useEffect(() => {
    setMedAttrs(idleState);

    if (medToBeUpdated) {
      var copied = JSON.parse(JSON.stringify(medToBeUpdated));

      if (!copied.medicationName) copied.medicationName = "";
      if (!copied?.prescribedBy) copied.prescribedBy = "";
      if (!copied.dose) copied.dose = "";
      if (!copied.dateStarted) copied.dateStarted = "";
      if (!copied.dateStopped) copied.dateStopped = "";
      if (!copied.lastRefill) copied.lastRefill = "";
      setMedAttrs(copied);
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const onChange = (e) => {
    const val = e.target.value;
    const name = e.target.name;
    setMedAttrs({
      ...medAttrs,
      [name]: val,
    });
  };

  const modalRef = useRef(null);
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  const handleSave = () => {
    const params = {};
    if (medAttrs.medicationName)
      params.medicationName = medAttrs.medicationName;
    if (medAttrs.dateStarted) params.dateStarted = medAttrs.dateStarted;
    if (medToBeUpdated) params.uid = medToBeUpdated.uid;
    onSave(params);
  };
  return (
    <div
      ref={modalRef}
      className={`${
        isOpen ? "fixed" : "hidden"
      } bg-white w-144  fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 shadow-md border rounded-lg z-20`}
    >
      <div className="border-b">
        <div className="flex flex-row items-center p-6">
          <button onClick={onClose}>
            <AiOutlineCloseCircle size={20} />
          </button>
          <span className="ml-4">
            {medToBeUpdated ? "Update medication" : "Add medication"}
          </span>
        </div>
      </div>
      <div className="px-6 py-8  ">
        <form className="flex flex-col space-y-6">
          <TextInput
            onChange={onChange}
            name="medicationName"
            value={medAttrs.medicationName}
            label="Medication name"
            placeholder="Enter medication mame..."
          />
          <DatePicker
            onChange={onChange}
            name="dateStarted"
            value={medAttrs.dateStarted}
            label="Date started"
          />
        </form>

        {medToBeUpdated ? (
          <div>
            <button
              onClick={() => onRemoveMedication(medToBeUpdated.uid)}
              className="mt-6 p-3 px-8 text-sm border border-red-600 text-red-600 rounded-lg"
            >
              Remove medication
            </button>
          </div>
        ) : null}
      </div>
      <div className="flex flex-row justify-end p-6 py-4 border-t">
        <button
          onClick={handleSave}
          className="p-3 px-8 font-bold border rounded-lg bg-black text-white"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddMedicationModal;
