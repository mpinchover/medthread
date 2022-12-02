import { useState } from "react";

import { useNavigate } from "react-router-dom";
const PatientVerificationPage = () => {
  const [status, setStatus] = useState("IDLE");
  const navigate = useNavigate();

  const handleSubmit = () => {
    setStatus("LOADING");

    setTimeout(() => {
      setStatus("COMPLETED");
    }, 1500);

    setTimeout(() => {
      navigate("/medication-list-patient");
    }, 2500);
  };

  /*
  <div className="animate-spin mr-2">
              <div className=" rounded-full border border-blue-200 border-t-blue-400  w-4 h-4"></div>
            </div>
             */

  const renderFooter = () => {
    if (status === "IDLE") {
      return (
        <button
          onClick={handleSubmit}
          className="mt-3 hover:shadow-none shadow-lg p-3 px-8 text-sm border rounded-lg bg-blue-600 text-white"
        >
          I authorize release of my health insurance claims records
        </button>
      );
    }
    if (status === "LOADING") {
      return (
        <button
          onClick={handleSubmit}
          className="flex flex-row items-center mt-3 hover:shadow-none shadow-lg p-3 px-8 text-sm border rounded-lg bg-blue-600 text-white"
        >
          <div className="animate-spin mr-2">
            <div className=" rounded-full border border-blue-200 border-t-blue-400  w-4 h-4"></div>
          </div>
          <span className="">Authorizing...</span>
        </button>
      );
    }
    if (status === "COMPLETED") {
      return (
        <div className="text-2xl text-blue-600">Authorization complete!</div>
      );
    }
  };

  return (
    <div className="px-28 flex flex-row justify-center">
      <div className="mt-20">
        <div className="text-2xl text-blue-600 mb-1">Hi Matt!</div>
        <div className="mb-1">
          We're excited to see you at{" "}
          <span className="text-blue-600 font-bold">
            9:30AM, Monday, Dec 20th, 2022
          </span>{" "}
          at{" "}
          <span className="text-blue-600 font-bold">
            322 Poland Drive, Manhattan, NYC 11217{" "}
          </span>
        </div>
        <div className="mb-1">
          Please authorize Dr. Kamulah Jane to view your health insurance
          records before your appointment
        </div>
        <div className="mb-1">See you soon!</div>
        {renderFooter()}
      </div>
    </div>
  );
};

export default PatientVerificationPage;
