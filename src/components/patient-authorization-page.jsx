import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import { PrivateRoute, withPrivateRoute } from "./hocs";
import { useRecoilCallback } from "recoil";
import { addHealthcareProviderCallback } from "../recoil/profile/profile";
import { getAuth } from "firebase/auth";
const PatientAuthorizationPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const auth = getAuth();
    addHealthcareProviderCbk(auth, email, name);
    setConfirmEmail("");
    setName("");
    setEmail("");
    navigate("/settings");
  };

  const addHealthcareProviderCbk = useRecoilCallback(
    addHealthcareProviderCallback
  );

  return (
    <div className="flex flex-col  flex-1 items-center justify-center ">
      <div className="  w-72 text-center py-2 mb-2  text-gray-600 ">
        Authorize provider to view medical records
      </div>

      <div className="  w-72 border-b border-blue-400 mb-4"></div>
      <form onSubmit={handleSubmit}>
        <div className="">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border focus:outline-none px-2 py-2 w-72 mb-4"
            placeholder="Provider email"
          />
        </div>
        <div className="">
          <input
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            className="border focus:outline-none px-2 py-2 w-72 mb-4"
            placeholder="Confirm provider email"
          />
        </div>
        <div className="">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border focus:outline-none px-2 py-2 w-72 mb-4"
            placeholder="Provider name (optional)"
          />
        </div>
        <div className="mb-4">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-72 text-sm text-center border rounded-sm px-3 py-3 bg-blue-400 text-white hover:opacity-50"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default withPrivateRoute(PatientAuthorizationPage);
