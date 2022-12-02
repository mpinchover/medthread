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

const CheckboxInput = ({ label, placeholder, name, type, value, onChange }) => {
  return (
    <div className="relative mb-8 last:mb-0">
      <label className="text-xs font-bold left-4 top-3 ">{label}</label>
      <input
        name={name}
        type="checkbox"
        className="w-full pt-7 pb-2 px-4 border rounded-md"
        placeholder="Enter medication name"
      />
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

const idleState = {
  itemName: "",
  prescribedBy: "",
  dose: "",
  date: "",
  dateStopped: "",
  lastRefill: "",
};

const MedicationFilterModal = ({ isOpen, onClose }) => {
  //   useEffect(() => {
  //     setMedAttrs(idleState);

  //     if (medToBeUpdated) {
  //       var copied = JSON.parse(JSON.stringify(medToBeUpdated));

  //       if (!copied.itemName) copied.itemName = "";
  //       if (!copied?.prescribedBy) copied.prescribedBy = "";
  //       if (!copied.dose) copied.dose = "";
  //       if (!copied.date) copied.date = "";
  //       if (!copied.dateStopped) copied.dateStopped = "";
  //       if (!copied.lastRefill) copied.lastRefill = "";
  //       setMedAttrs(copied);
  //     }
  //   }, [isOpen]);

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
        <form className="grid">
          <div className="">
            <DateInput name="startedAfter" label="Started after" />
            <DateInput name="endedBefore" label="Ended before" />
            <CheckboxInput name="status" label={"Active"} />
          </div>
        </form>

        {medToBeUpdated ? (
          <div>
            <button className="mt-6 p-3 px-8 text-sm border border-red-600 text-red-600 rounded-lg">
              Remove medication
            </button>
          </div>
        ) : null}
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
