import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AiOutlineRadiusUpleft, AiOutlineMenu } from "react-icons/ai";
const NavbarLoggedOut = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const pathname = location.pathname;
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    let regex = /\//;
    let result = pathname.replace(regex, "");
    result = result.replace("-", "_");
    if (result !== activeTab) _setActiveTab(result);
  }, [location]);

  const handleClick = (e) => {
    _setActiveTab(e.target.id);
  };

  const _setActiveTab = (tab) => {
    if (tab === "previous_patients") {
      setActiveTab("previous_patients");
      navigate("/previous-patients");
    } else if (tab === "contact") {
      setActiveTab("contact");
    } else if (tab === "logout") {
      setActiveTab("logout");
    } else if (tab === "active_patient") {
      setActiveTab("active_patient");
      navigate("/active-patient");
    } else if (tab === "provider_login") {
      setActiveTab("provider_login");
      navigate("/provider-login");
    } else if (tab === "patient_login") {
      navigate("/patient-login");
      setActiveTab("patient_login");
    }

    const navbar = document.getElementById("navbar");
  };

  return (
    <div
      id="navbar"
      className="shadow-sm py-7 px-2 md:px-28 flex flex-row sticky top-0 z-50 bg-white"
    >
      <div className="flex-1 flex flex-row">
        <button onClick={() => navigate("/")} className="flex flex-row">
          <AiOutlineRadiusUpleft style={{ fontSize: 26, color: "blue" }} />
          <div className="hidden md:block ml-2 font-thin text-blue-700">
            med<span className="font-normal">thread</span>{" "}
            <span>
              {process.env.REACT_APP_MEDTHREAD_ENV === "STAGING"
                ? "STAGING"
                : null}
            </span>
          </div>
        </button>
      </div>

      <button className="md:hidden">
        <AiOutlineMenu style={{ fontSize: 26, color: "grey" }} />
      </button>
      <div className="hidden md:block">
        <button
          id="patient_login"
          onClick={handleClick}
          className={`${
            activeTab === "patient_login" ? "black" : "text-gray-400"
          } hover:opacity-50 cursor-pointer mr-8 `}
        >
          Patient Login
        </button>
        <button
          id="provider_login"
          onClick={handleClick}
          className={`${
            activeTab === "provider_login" ? "black" : "text-gray-400"
          } hover:opacity-50 cursor-pointer mr-8 `}
        >
          Provider Login
        </button>
        <button
          id="contact"
          onClick={handleClick}
          className={`${
            activeTab === "contact" ? "black" : "text-gray-400"
          } hover:opacity-50 cursor-pointer  `}
        >
          Contact
        </button>
      </div>
    </div>
  );
};

export default NavbarLoggedOut;
