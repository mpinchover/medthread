import { useState } from "react";
import {
  sendMedicationsToProviderCallback,
  isSendingMedicationsState,
} from "../recoil/medications/medications";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
import { withPrivateRoute } from "./hocs";

const SendMedications = () => {
  const navigate = useNavigate();
  const [healthcareProviderEmail, setHealthcareProviderEmail] = useState("");
  const [healthcareProviderName, setHealthcareProviderName] = useState("");
  const sendMedicationsToProvider = useRecoilCallback(
    sendMedicationsToProviderCallback
  );
  const isSendingMedications = useRecoilValue(isSendingMedicationsState);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMedicationsToProvider(healthcareProviderEmail, healthcareProviderName);
  };

  const handleSendMedicationsEvent = (e) => {
    if (e.type === "FAILED_SEND_MEDICATIONS_EVENT") {
      toast.error("Failed to send medications", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    } else {
      toast.success("Medications sent!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    setTimeout(() => navigate(-1), 1000);
  };

  useEffect(() => {
    document.addEventListener(
      "SUCCESS_SEND_MEDICATIONS_EVENT",
      handleSendMedicationsEvent
    );
    document.addEventListener(
      "FAILED_SEND_MEDICATIONS_EVENT",
      handleSendMedicationsEvent
    );

    return function cleanupListener() {
      document.removeEventListener(
        "SUCCESS_SEND_MEDICATIONS_EVENT",
        handleSendMedicationsEvent
      );
      document.removeEventListener(
        "FAILED_SEND_MEDICATIONS_EVENT",
        handleSendMedicationsEvent
      );
    };
  }, []);
  return (
    <div className="px-2 md:px-28 py-2 md:py-10 flex flex-1 flex-col bg-gray-100 items-center justify-center">
      <div className="border bg-white p-10">
        <div className="mb-2">
          <div className="  w-72 text-center  text-gray-600 ">
            Authorize provider to view medications
          </div>
          <div className="  w-72 text-center text-sm  text-gray-600 ">
            (Please do this 20 minutes before your appointment)
          </div>
        </div>

        <div className="  w-72 border-b border-blue-400 my-6"></div>
        <form onSubmit={handleSubmit}>
          <div className="">
            <input
              value={healthcareProviderEmail}
              onChange={(e) => setHealthcareProviderEmail(e.target.value)}
              className="border focus:outline-none px-2 py-2 w-72 mb-4"
              placeholder="Provider email"
            />
          </div>
          <div className="">
            <input
              value={healthcareProviderName}
              onChange={(e) => setHealthcareProviderName(e.target.value)}
              className="border focus:outline-none px-2 py-2 w-72 mb-4"
              placeholder="Provider name (optional)"
            />
          </div>

          <div className="mb-4">
            {isSendingMedications ? (
              <div className=" flex flex-row items-center ">
                <div className="animate-spin mr-2">
                  <div className=" rounded-full border border-blue-200 border-t-blue-400  w-4 h-4"></div>
                </div>
                <span className="text-blue-400">Sending medications...</span>
              </div>
            ) : (
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-72 text-sm text-center border rounded-sm px-3 py-3 bg-blue-400 text-white hover:opacity-50"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default withPrivateRoute(SendMedications);
