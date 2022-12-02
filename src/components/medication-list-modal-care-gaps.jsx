import React, { useState, useEffect } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import {
  FaPen,
  FaSyringe,
  FaDiagnoses,
  FaProcedures,
  FaAllergies,
} from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";
import { MdOutlineMonitorWeight } from "react-icons/md";
import { TbDeviceMobile } from "react-icons/tb";
import { RiMentalHealthFill } from "react-icons/ri";

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

const CareGapsModal = ({ isOpen, onClose }) => {
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
          <span className="ml-4">Care gaps</span>
        </div>
      </div>

      <div className="px-6 py-8  ">
        <div className="flex flex-row items-center mb-1">
          <AiFillHeart />
          <div className="ml-2 text-xl font-bold">Cardiovascular</div>
        </div>

        <div className="text-sm ">Controlling high blood pressure</div>
        <div className="text-sm mb-8">
          {" "}
          Statin Therapy for Patients with Cardiovascular Disease{" "}
        </div>

        <div className="flex flex-row items-center mb-1">
          <TbDeviceMobile />
          <div className="ml-1 text-xl font-bold">Diabetes</div>
        </div>

        <div className="text-sm mb-8 ">
          Comprehensive Diabetes Care (CDC) HbA1c Testing
        </div>

        <div className="flex flex-row items-center mb-1">
          <RiMentalHealthFill />
          <div className="ml-2 text-xl font-bold">Behavioral health</div>
        </div>

        <div className="text-sm ">Antidepressant Medication Management</div>
      </div>
    </div>
  );
};

export default CareGapsModal;
