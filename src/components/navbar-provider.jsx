import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AiOutlineRadiusUpleft } from "react-icons/ai";
import { FirebaseContext } from "../firebase/firebase-context";
const ProviderNavbar = () => {
  const navigate = useNavigate();
  const { signOutUser } = useContext(FirebaseContext);
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
      <div className="flex-1 flex flex-row">
        <button onClick={() => navigate("/")} className="flex flex-row">
          <AiOutlineRadiusUpleft style={{ fontSize: 26, color: "blue" }} />
          <div className="hidden md:block ml-2 font-thin text-blue-700">
            med<span className="font-normal">thread</span>
            <span>
              {process.env.REACT_APP_MEDTHREAD_ENV === "STAGING"
                ? "STAGING"
                : null}
            </span>
          </div>
        </button>
      </div>

      <div className="">
        {/* <button
          id="previous_patients"
          onClick={handleClick}
          className={`${
            activeTab === "previous_patients" ? "black" : "text-gray-400"
          } hover:opacity-50 cursor-pointer mr-4 `}
        >
          Previous Patients
        </button> */}

        <button
          id="logout"
          onClick={handleClick}
          className={`${
            activeTab === "logout" ? "black" : "text-gray-400"
          } hover:opacity-50 cursor-pointer mr-4 `}
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default ProviderNavbar;
