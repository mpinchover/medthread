import React, { useState, useEffect, useRef } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { TextInput, DatePicker, TextInputWithEdit } from "./common";
import { FaPen, FaPlus, FaMinusCircle } from "react-icons/fa";

const AccountModal = ({ isOpen, onSave, onClose, medToBeUpdated }) => {
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const onChange = (e) => {
    const val = e.target.value;
    const name = e.target.name;
  };

  const modalRef = useRef(null);
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  const providers = [{}];

  return (
    <div
      ref={modalRef}
      className={`${
        isOpen ? "fixed" : "hidden"
      } bg-white w-144  fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 shadow-md border rounded-lg z-20`}
    >
      <div className="border-b ">
        <div className="flex flex-row items-center p-6">
          <button onClick={onClose}>
            <AiOutlineCloseCircle size={20} />
          </button>
          <span className="ml-4">Account</span>
        </div>
      </div>

      <section className="px-6 mt-8 h-60 relative">
        <TextInputWithEdit
          // onChange={onChange}
          name="email"
          // value={medAttrs.medicationName}
          label="Email"
        />

        {isEditingPassword ? (
          <section>
            <TextInput
              // onChange={onChange}
              name="PASSWORD"
              // value={medAttrs.medicationName}
              label="New password"
            />
            <button
              onClick={(e) => setIsEditingPassword(false)}
              className="p-3 px-8 text-sm mr-2 border rounded-lg mb-2"
            >
              Cancel
            </button>
            <button className="p-3 px-8 text-sm bg-black text-white border rounded-lg mb-2">
              Save
            </button>
          </section>
        ) : (
          <button
            onClick={(e) => setIsEditingPassword(true)}
            className="p-3 px-8 text-sm border rounded-lg mb-2"
          >
            Update password
          </button>
        )}
      </section>

      <section className="px-6 mb-8 mt-8">
        <div className="text-lg font-bold mb-2">Insurance providers</div>
        <section className="h-52 overflow-y-scroll">
          {providers.map((e, i) => {
            return <div key={i}>No healthcare providers</div>;
          })}
        </section>
      </section>
    </div>
  );
};

export default AccountModal;
