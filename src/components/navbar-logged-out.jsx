import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AiOutlineRadiusUpleft } from "react-icons/ai";
import { FirebaseContext } from "../firebase/firebase-context";
import { AiOutlineMenu } from "react-icons/ai";
import { HeadlessDropdown } from "./common";

const navbarDropdownMenuOptions = [
  { name: "PATIENT_LOGIN", display: "Patient login" },
  { name: "PROVIDER_LOGIN", display: "Provider login" },
  { name: "CONTACT", display: "Contact" },
];

const NavbarLoggedOut = () => {
  const navigate = useNavigate();
  const { signOutUser } = useContext(FirebaseContext);
  const location = useLocation();
  const pathname = location.pathname;
  const [activeTab, setActiveTab] = useState(null);

  const [isOpen, toggleOpen] = useState(false);

  const onDropdownClick = (e) => {
    const name = e.target.name;
    if (name === "PROVIDER_LOGIN") navigate("/provider-login");
    if (name === "PATIENT_LOGIN") navigate("/patient-login");
    if (name === "PREVIOUS_PATIENTS") navigate("/previous-patients");
  };

  const handleToggleOpen = (e) => {
    e.preventDefault();
    toggleOpen(!isOpen);
  };

  const mainDropdownRefBtn = useRef(null);

  useEffect(() => {
    let regex = /\//;
    let result = pathname.replace(regex, "");
    result = result.replace("-", "_");

    if (result !== activeTab) _setActiveTab(result);
  }, [location]);

  const handleClick = (e) => {
    _setActiveTab(e.target.id);
  };

  const _setActiveTab = async (tab) => {
    if (tab === "logout") {
      await signOutUser();
      navigate("/");
    } else if (tab === "previous_patients") {
      setActiveTab("previous_patients");
      navigate("/previous-patients");
    } else if (tab === "contact") {
      setActiveTab("contact");
    } else if (tab === "active_patient") {
      setActiveTab("active_patient");
      navigate("/active-patient");
    }
  };

  return (
    <div
      id="navbar"
      className="shadow-sm py-7 px-2 md:px-28 flex flex-row sticky top-0 z-50 bg-white"
    >
      <div className="flex-1 flex flex-row ">
        <button
          onClick={() => navigate("/")}
          className="flex flex-row items-center"
        >
          <AiOutlineRadiusUpleft style={{ fontSize: 26, color: "blue" }} />
          <div className="text-lg hidden md:block ml-2 font-thin text-blue-700">
            <span className="font-bold">medthread</span>
            <span>
              {process.env.REACT_APP_MEDTHREAD_ENV === "STAGING"
                ? "STAGING"
                : null}
            </span>
          </div>
        </button>
      </div>

      <div className="relative">
        <button
          onClick={handleToggleOpen}
          ref={mainDropdownRefBtn}
          className="rounded-full border relative flex flex-row items-center justify-center space-x-2 p-2 px-4 "
        >
          <AiOutlineMenu size={16} />
        </button>
        <HeadlessDropdown
          options={navbarDropdownMenuOptions}
          isOpen={isOpen}
          onClick={onDropdownClick}
          toggleOpen={toggleOpen}
          mainDropdownRefBtn={mainDropdownRefBtn}
        />
        {/* 
        <button
          id="logout"
          onClick={handleClick}
          className={`${
            activeTab === "logout" ? "black" : "text-gray-400"
          } hover:opacity-50 cursor-pointer mr-4 `}
        >
          Log out
        </button> */}
      </div>
    </div>
  );
};

export default NavbarLoggedOut;
