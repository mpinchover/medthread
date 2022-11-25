import { FaPen, FaPlus, FaMinusCircle } from "react-icons/fa";
import { AiOutlineHistory } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import {
  isUpdatingProfileAccountState,
  profileAccountState,
} from "../recoil/profile/profile";
import { TextInput } from "./common";
import { useRecoilValue } from "recoil";
import { FaPills } from "react-icons/fa";
import { withPrivateRoute } from "./hocs";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { FirebaseContext } from "../firebase/firebase-context";

const InsuranceProvider = ({ providerName }) => {
  return (
    <div className="inline-block">
      <span className="flex flex-row items-center px-2 py-2 rounded-sm  ">
        <button>
          <FaMinusCircle size={18} color={"red"} />
        </button>
        <span className="ml-2">{providerName}</span>
      </span>
    </div>
  );
};

const HealthcareProvider = ({ providerName, providerEmail }) => {
  return (
    <div className="inline-block">
      <span className="flex flex-row items-center px-2 py-2 rounded-sm  ">
        <button>
          <FaMinusCircle size={18} color={"red"} />
        </button>
        <span className="ml-2">{providerEmail}</span>
        <span className="ml-2">({providerName})</span>
      </span>
    </div>
  );
};

const ProviderSettings = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const { updateAccountInformation } = useContext(FirebaseContext);

  const accountSettings = useRecoilValue(profileAccountState);

  const [email, setEmail] = useState(auth?.currentUser?.email);
  const [displayName, setDisplayName] = useState(accountSettings.displayName);
  const [mobile, setMobile] = useState(accountSettings.mobile);
  const [isEditMode, setIsEditMode] = useState(false);

  const isUpdatingProfileAccount = useRecoilValue(
    isUpdatingProfileAccountState
  );

  const onAccountSettingsChange = (e) => {
    e.preventDefault();

    if (e.target.id === "email") {
      setEmail(e.target.value);
    } else if (e.target.id === "name") {
      setDisplayName(e.target.value);
    } else if (e.target.id === "mobile") {
      setMobile(e.target.value);
    }
  };

  const handleUpdateAccountInformation = () => {
    setIsEditMode(true);
  };

  const handleSaveAccountInformation = (e) => {
    e.preventDefault();
    updateAccountInformation({
      displayName,
      email,
      mobile,
    });
    setIsEditMode(false);
  };

  const handleCancelSave = (e) => {
    e.preventDefault();

    setEmail(auth?.currentUser?.email);
    setDisplayName(accountSettings.displayName);
    setMobile(accountSettings.mobile);

    setIsEditMode(false);
  };

  return (
    <div className="px-28 py-10 flex flex-1 flex-col bg-gray-100">
      <section className="border rounded-sm mb-8  p-10 bg-white ">
        <div className="text-xl mb-8">Personal information</div>

        <section className="">
          <section className="mb-4">
            <TextInput
              id={"name"}
              onChange={onAccountSettingsChange}
              disabled={!isEditMode}
              value={displayName}
              label={"Name"}
            />
          </section>
          <section className="mb-4">
            <TextInput
              disabled={!isEditMode}
              id={"email"}
              onChange={onAccountSettingsChange}
              value={email}
              label={"Email"}
            />
          </section>

          <section className="mb-4">
            <TextInput
              disabled={!isEditMode}
              id={"mobile"}
              onChange={onAccountSettingsChange}
              value={mobile}
              label={"Mobile"}
            />
          </section>
          <section className="mb-4">
            {isEditMode ? null : (
              <button
                onClick={handleUpdateAccountInformation}
                className=" flex flex-row items-center text-blue-400 "
              >
                <FaPen size={14} />
                <span className="ml-1">Update information</span>
              </button>
            )}

            <section className={`${isEditMode ? "block" : "hidden"}`}>
              {isUpdatingProfileAccount ? (
                <button
                  disabled
                  className=" flex flex-row items-center px-6 py-2 text-white bg-blue-600 mb-1 border rounded-sm"
                >
                  <div className="animate-spin mr-2">
                    <div className=" rounded-full border border-blue-200 border-t-blue-400  w-4 h-4"></div>
                  </div>
                  <span>Saving...</span>
                </button>
              ) : (
                <>
                  {" "}
                  <button
                    className="bg-blue-600 text-white  px-6 py-2 rounded-sm"
                    onClick={handleSaveAccountInformation}
                    id="patient-settings-save"
                  >
                    Save
                  </button>
                  <button
                    className="border border-gray-400 ml-4 rounded-sm px-6 py-2"
                    onClick={handleCancelSave}
                    id="patient-settings-cancel"
                  >
                    Cancel
                  </button>
                </>
              )}
            </section>
          </section>

          <button
            onClick={() => navigate("/update-password")}
            className="mt-4 px-6 py-2 border rounded-sm"
          >
            Update password
          </button>
        </section>
      </section>
      <section className="border rounded-sm  bg-white mb-8 p-10">
        <div className="text-xl mb-8">Patient history</div>
        <button
          onClick={() => navigate("/")}
          className=" flex flex-row items-center  text-blue-400 "
        >
          <AiOutlineHistory size={18} />
          <span className="ml-2">View previous patients</span>
        </button>
        {/* <div className="text-sm mb-4">
          View or make updates to your medical history.
        </div> */}
      </section>
    </div>
  );
};

export default withPrivateRoute(ProviderSettings);
