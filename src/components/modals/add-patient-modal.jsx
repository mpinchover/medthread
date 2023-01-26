import React, { useState, useEffect, useRef } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { TextInput, DatePicker } from "../common";
import { activeTimelineEventState } from "../../recoil/timeline/timeline";
import { useRecoilCallback, useRecoilState } from "recoil";
import { getFormattedDate } from "../utils";

const AddPatientModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const modalRef = useRef(null);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div
      ref={modalRef}
      className={`${
        isOpen ? "fixed" : "hidden"
      }  bg-white w-144  fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 shadow-md border rounded-lg z-20`}
    >
      <div className="border-b">
        <div className="flex flex-row items-center p-6">
          <button onClick={onClose}>
            <AiOutlineCloseCircle size={20} />
          </button>
          <span className="ml-4">Add patient</span>
        </div>
      </div>
      <div className="h-72 p-6">
        <TextInput
          label="Patient email"
          info=" An email will be sent to the patient asking them to sign up and enter
          their insurance information."
          placeholder="Enter patient email..."
        />
      </div>

      <div className="px-6 py-4  "></div>
      <div className="flex flex-row justify-end p-6 py-4 border-t">
        <button
          onClick={handleSend}
          className="p-3 px-8 font-bold border rounded-lg bg-black text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AddPatientModal;
