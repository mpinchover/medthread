import React, { useState, useEffect, useRef } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import previousPatients from "./previous-patients";
import { TextInput, DatePicker } from "./common";
import { FaTrash } from "react-icons/fa";
const prevProviders = [
  {
    providerEmail: "drkumanah@nycdoctors.com",
  },
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
];
const SendMedicationsModal = ({ isOpen, onSend, onClose, medToBeUpdated }) => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const onChange = (e) => {
    const val = e.target.value;
    const name = e.target.name;
    setEmail(val);
  };

  const modalRef = useRef(null);
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
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
          <span className="ml-4">Send medications</span>
        </div>
      </div>
      <div className="h-72 overflow-y-scroll p-6">
        <div className="font-bold ">Previous providers</div>
        <ul className="">
          {prevProviders.map((e, i) => {
            return (
              <li
                key={i}
                className="text-m border-b last:border-b-0 py-6 flex flex-row justify-between items-center"
              >
                <button
                  onClick={() => setEmail(e.providerEmail)}
                  name={e.providerEmail}
                  className=""
                >
                  drkumanah@nycdoctors.com
                </button>
                <button>
                  <FaTrash />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <form onSubmit={onClose} className="">
        <div className="px-6 py-4  ">
          <TextInput
            onChange={onChange}
            name="email"
            value={email}
            placeholder={"Email address..."}
            label="Provider email"
            info={"Type an email address or select one from the list"}
          />
          <div className="text-xs"></div>
        </div>
        <div className="flex flex-row justify-end p-6 py-4 border-t">
          <button
            type="submit"
            onClick={onSend}
            className="p-3 px-8 font-bold border rounded-lg bg-black text-white"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendMedicationsModal;