import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AiOutlineRadiusUpleft } from "react-icons/ai";
import { FirebaseContext } from "../firebase/firebase-context";
import { AiOutlineMenu, AiOutlineMail } from "react-icons/ai";
import { HeadlessDropdown } from "./common";
import { TbPill, TbFiles } from "react-icons/tb";
import { MdAccountCircle } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { RiSendPlaneFill } from "react-icons/ri";
import { AiOutlinePlus, AiOutlineHistory } from "react-icons/ai";

const navbarDropdownMenuOptions = [
  {
    name: "PREVIOUS_PATIENTS",
    display: "Previous patients",
    icon: AiOutlineHistory,
  },
  { name: "ACCOUNT", display: "Account", icon: MdAccountCircle },
  {
    name: "CONTACT",
    link: "mailto:info@usemedthread.com",
    display: "Contact",
    icon: AiOutlineMail,
  },
  { name: "LOGOUT", display: "Log out", icon: FiLogOut },
];

const ProviderNavbar = ({ authUser }) => {
  const navigate = useNavigate();
  const { signOutUser } = useContext(FirebaseContext);
  const location = useLocation();
  const pathname = location.pathname;
  const [activeTab, setActiveTab] = useState(null);

  const [isOpen, toggleOpen] = useState(false);

  const onDropdownClick = (e) => {
    const name = e.currentTarget.name;
    if (name === "PREVIOUS_PATIENTS") navigate("/previous-patients");

    if (name === "PREVIOUS_PATIENTS") navigate("/previous-patients");
    if (name === "ACCOUNT") navigate("/settings");
    if (name === "RECORDS") {
      navigate("/");
    }
    if (name === "LOGOUT") {
      signOutUser();
    }
  };

  const handleToggleOpen = (e) => {
    e.preventDefault();
    toggleOpen(!isOpen);
  };

  const mainDropdownRefBtn = useRef(null);

  let name = authUser?.account?.displayName;
  if (name && name.length > 0) name = name[0].toUpperCase();
  return (
    <div
      id="navbar"
      className="shadow-sm py-7 px-2 md:px-28 flex flex-row sticky top-0 z-10 bg-white"
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
          <div>{name}</div>
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

export default ProviderNavbar;
