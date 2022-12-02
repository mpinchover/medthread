import React, { useState, useEffect } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";

const TextInput = ({ label, placeholder, name, type, value, onChange }) => {
  return (
    <div className="relative mb-8 last:mb-0">
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full pt-7 pb-2 px-4 border rounded-md"
        placeholder="Enter medication name"
      />
      <label className="text-xs font-bold absolute left-4 top-3 ">
        {label}
      </label>
    </div>
  );
};

const DateInput = ({ label, placeholder, name, type, value, onChange }) => {
  return (
    <div className="relative mb-8 last:mb-0">
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

const AddMedicationModal = ({ isOpen, onSave, onClose, medToBeUpdated }) => {
  const [medAttrs, setMedAttrs] = useState({
    itemName: "",
    prescribedBy: "",
    dose: "",
    date: "",
    dateStopped: "",
    lastRefill: "",
  });

  useEffect(() => {
    if (medToBeUpdated) {
      var copied = JSON.parse(JSON.stringify(medToBeUpdated));

      if (!copied.itemName) copied.itemName = "";
      if (!copied?.prescribedBy) copied.prescribedBy = "";
      if (!copied.dose) copied.dose = "";
      if (!copied.date) copied.date = "";
      if (!copied.dateStopped) copied.dateStopped = "";
      if (!copied.lastRefill) copied.lastRefill = "";
      setMedAttrs(copied);
    }
  }, [medToBeUpdated]);

  const onChange = (e) => {
    const val = e.target.value;
    const name = e.target.name;

    setMedAttrs({
      ...medAttrs,
      [name]: val,
    });
  };

  return (
    <div
      className={`${
        isOpen ? "fixed" : "hidden"
      } bg-white w-144  fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 shadow-md border rounded-lg z-20`}
    >
      <div className="border-b">
        <div className="flex flex-row items-center p-6">
          <button onClick={onClose}>
            <AiOutlineCloseCircle size={20} />
          </button>
          <span className="ml-4">Add medication</span>
        </div>
      </div>
      <div className="px-6 py-8  ">
        <form className="grid grid-cols-2 gap-10">
          <div className="">
            <TextInput
              onChange={onChange}
              name="itemName"
              value={medAttrs.itemName}
              label="Medication name"
            />
            <TextInput
              onChange={onChange}
              name="prescribedBy"
              value={medAttrs.prescribedBy}
              label="Prescribed by"
            />
            <TextInput
              onChange={onChange}
              name="dose"
              value={medAttrs.dose}
              label="Doseage"
            />
          </div>
          <div>
            <DateInput
              onChange={onChange}
              name="date"
              value={medAttrs.date}
              label="Date started"
            />
            <DateInput
              onChange={onChange}
              name="dateStopped"
              value={medAttrs.dateStopped}
              label="Date stopped (optional)"
            />
            <DateInput
              onChange={onChange}
              name="lastRefill"
              value={medAttrs.lastRefill}
              label="Last refill (optional)"
            />
          </div>
        </form>
      </div>
      <div className="flex flex-row justify-end p-6 py-4 border-t">
        <button
          onClick={onClose}
          className="p-3 px-8 text-sm border rounded-lg bg-black text-white"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddMedicationModal;
