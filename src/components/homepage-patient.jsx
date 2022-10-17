import React, { useContext } from "react";
import ActivePatientHeader from "./active-patient-header";
import { useNavigate } from "react-router-dom";
import { FirebaseContext } from "../firebase/firebase-context";
import { useRecoilState } from "recoil";
import { authorizedProfileState } from "../recoil/auth/auth";
import { PrivateRoute, withPrivateRoute } from "./hocs";

const PatientHomepage = () => {
  const navigate = useNavigate();
  const [authorizedUser, setAuthorizedUser] = useRecoilState(
    authorizedProfileState
  );

  const handleSubmit = (e) => {
    if (e.target.id === "authorize_medical_provider") {
      navigate("/patient-authorization");
    }
  };

  return (
    <div className="flex-1 px-28 py-4 ">
      <section className="mb-4">
        <ActivePatientHeader />
      </section>
      <section className="flex flex-col border shadow-md px-4 py-5">
        <div className="w-96 mb-4">
          <button
            id="authorize_medical_provider"
            onClick={handleSubmit}
            className="text-blue-400 hover:opacity-50"
          >
            Authorize provider to see my records
          </button>
          <div className="text-sm text-gray-500">
            Allow a healthcare provider to view your medical records.
          </div>
        </div>
        <div className="w-96 mb-4">
          <button className="text-blue-400 hover:opacity-50">
            View my medical history
          </button>
          <div className="text-sm text-gray-500">
            View your medical history or update it.
          </div>
        </div>

        <div className="w-96">
          <button className="text-blue-400 hover:opacity-50">
            Show me medical insights
          </button>
          <div className="text-sm text-gray-500">
            Use machine learning to analyze your healthcare data and provide you
            insights on sleep, exercise and diet.
          </div>
        </div>
      </section>
    </div>
  );
};

export default withPrivateRoute(PatientHomepage);
