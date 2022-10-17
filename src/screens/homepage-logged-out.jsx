import React from "react";
import { useNavigate } from "react-router-dom";
const HomepageLoggedOut = () => {
  const navigate = useNavigate();
  return (
    // flex flex-col  flex-1
    <div className="px-2 md:px-28 py-4 text-center flex flex-1 flex-col items-center justify-center bg-[url('./assets/background.jpeg')] bg-cover">
      <h2 className="text-3xl md:text-7xl text-gray-300 mb-2 ">
        Healthcare data in one place
      </h2>
      <h2 className="text-xl  text-gray-300 md:w-128 mb-12">
        All patient records from all providers centralized in one place for the
        best quality healthcare.
      </h2>
      <button
        onClick={() => navigate("/provider-login")}
        className="border rounded-full border-gray-400 mb-3  text-gray-300 px-28 md:px-10 py-3 hover:opacity-70"
      >
        I am a provider
      </button>
      <button
        onClick={() => navigate("/patient-login")}
        className="border rounded-full border-gray-400 mb-3  text-gray-300 px-28 md:px-10 py-3 hover:opacity-70"
      >
        I am a patient
      </button>
    </div>
  );
};
//  <div className="px-2 md:px-28 py-4 text-center flex flex-1 flex-col items-center justify-center bg-[url('./assets/background.jpeg')] bg-cover">
export default HomepageLoggedOut;

// https://api.flexpa.com/fhir/metadata