import React, { useState, useEffect, useRef } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { TextInput, DatePicker } from "../common";
import { activeTimelineEventState } from "../../recoil/timeline/timeline";
import { useRecoilCallback, useRecoilState } from "recoil";
import { getFormattedDate } from "../utils";

const claimTypeEvent = {
  institutional: {
    title: "Inpatient",
    textColor: "text-red-600",
  },
  oral: {
    title: "Dentist",
    textColor: "text-blue-600",
  },
  pharmacy: {
    title: "Pharmacy",
    textColor: "text-blue-600",
  },
  professional: {
    title: "Outpatient",
    textColor: "text-blue-600",
  },
  vision: {
    title: "Vision",
    textColor: "text-blue-600",
  },
};

const EMRRequestDisplay = ({ display, label }) => {
  return (
    <div className="flex text-xs flex-row">
      <div className="w-32">{label}</div>
      <div className="">{display}</div>
    </div>
  );
};
const GetEMRRecordsModal = ({ isOpen, onClose }) => {
  const [activeTimelineEvent, setActiveTimelineEvent] = useRecoilState(
    activeTimelineEventState
  );

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
    setActiveTimelineEvent(null);
    onClose();
  };

  const date = activeTimelineEvent?.primaryDate;
  const claimType = claimTypeEvent[activeTimelineEvent?.type?.[0]?.code];

  return (
    <div
      ref={modalRef}
      className={`${
        isOpen ? "fixed" : "hidden"
      }  bg-white w-144 w-96 fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 shadow-md border rounded-lg z-20`}
    >
      <div className="border-b">
        <div className="flex flex-row items-center p-6">
          <button onClick={onClose}>
            <AiOutlineCloseCircle size={20} />
          </button>
          <span className="ml-4">EMR Request</span>
        </div>
      </div>
      <div className="h-72 p-6">
        <div className="font-bold ">EMR event</div>
        <EMRRequestDisplay label="Date" display={getFormattedDate(date)} />
        <EMRRequestDisplay label="Visit type" display={claimType?.title} />
        <EMRRequestDisplay
          label="Provider"
          display={activeTimelineEvent?.provider?.display}
        />
        <EMRRequestDisplay
          label="NPI"
          display={activeTimelineEvent?.provider?.npiCode}
        />
        {/* <div>
          <div className={`${claimType?.textColor}`}>{claimType?.title}</div>
        </div> */}
        {/* <div className={""}>{activeTimelineEvent?.provider?.display}</div>
        <div className={""}>{activeTimelineEvent?.provider?.npiCode}</div> */}
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

export default GetEMRRecordsModal;
