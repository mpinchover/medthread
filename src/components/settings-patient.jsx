import { FaPen, FaPlus, FaMinusCircle } from "react-icons/fa";
import { AiOutlinePlus, AiOutlineSend } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import {
  insuranceProvidersState,
  addInsuranceProviderCallback,
  getInsuranceProvidersCallback,
  isAddingInsuranceProviderState,
  addHealthcareProviderCallback,
  isAddingHealthcareProviderState,
  isUpdatingProfileAccountState,
  profileAccountState,
} from "../recoil/profile/profile";
import { TextInput } from "./common";
import {
  useRecoilState,
  useSetRecoilState,
  useRecoilValue,
  useRecoilCallback,
} from "recoil";
import { FaPills } from "react-icons/fa";

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

const PatientSettings = ({ insuranceProviders, healthcareProviders }) => {
  const navigate = useNavigate();
  const auth = getAuth();
  const isAddingInsuranceProvider = useRecoilValue(
    isAddingInsuranceProviderState
  );
  const isAddingHealthcareProvider = useRecoilValue(
    isAddingHealthcareProviderState
  );
  const addInsuranceProviderCbk = useRecoilCallback(
    addInsuranceProviderCallback
  );
  const { updateAccountInformation } = useContext(FirebaseContext);

  const accountSettings = useRecoilValue(profileAccountState);

  const [email, setEmail] = useState(auth?.currentUser?.email);
  const [displayName, setDisplayName] = useState(accountSettings.displayName);
  const [mobile, setMobile] = useState(accountSettings.mobile);
  const [isEditMode, setIsEditMode] = useState(false);

  const isUpdatingProfileAccount = useRecoilValue(
    isUpdatingProfileAccountState
  );

  // window.FlexpaLink.create({
  //   publishableKey: "pk_test_pKDGhsAjAOiDxw6LdHuoogYupzm9VNnQh113WuCoK6I",
  //   onSuccess: async (publicToken) => {
  //     addInsuranceProviderCbk(publicToken);
  //   },
  // });

  const openFlexpaLink = () => {
    window.FlexpaLink.open();
  };

  const renderInsuranceProviders = () => {
    return insuranceProviders.map((e, i) => {
      return (
        <li key={i}>
          <InsuranceProvider providerName={e.insuranceProviderName} />
        </li>
      );
    });
  };

  const handleAddHealthcareProvider = (e) => {
    e.preventDefault();
    navigate("/patient-authorization");
  };

  const renderHealthcareProviders = () => {
    return healthcareProviders.map((e, i) => {
      return (
        <li key={i}>
          <HealthcareProvider
            providerEmail={e.healthcareProviderEmail}
            providerName={e.healthcareProviderName}
          />
        </li>
      );
    });
  };

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
            className=" px-6 py-2 border rounded-sm"
          >
            Update password
          </button>
        </section>
      </section>
      <section className="border rounded-sm  bg-white mb-8 p-10">
        <div className="text-xl mb-8">Medical history</div>
        <button
          onClick={() => navigate("/medication-list-patient")}
          className=" flex flex-row items-center  text-blue-400 "
        >
          <FaPills size={18} />
          <span className="ml-2">View history</span>
        </button>
        <div className="text-sm mb-4">
          View or make updates to your medical history.
        </div>
        <button
          onClick={() => navigate("/send-medications")}
          className=" flex flex-row items-center   text-blue-400 "
        >
          <AiOutlineSend size={18} />
          <span className="ml-2">Send medications</span>
        </button>
        <div className="text-sm">
          Send medications to your healthcare provider.
        </div>
      </section>

      <section className="border rounded-sm  bg-white mb-8 p-10">
        <div className="text-xl mb-8">Authorized insurance providers</div>
        {isAddingInsuranceProvider ? (
          <button
            disabled
            className=" flex flex-row items-center px-6 py-1 text-white bg-blue-600 mb-1 border rounded-sm"
          >
            <div className="animate-spin mr-2">
              <div className=" rounded-full border border-blue-200 border-t-blue-400  w-4 h-4"></div>
            </div>
            <span>Adding insurance provider...</span>
          </button>
        ) : (
          <button
            onClick={openFlexpaLink}
            className=" flex flex-row items-center  text-blue-600 mb-1 "
          >
            <AiOutlinePlus size={18} />
            <span className="ml-1">Add provider</span>
          </button>
        )}
        <div className="text-sm">
          Link your past medical history from insurance claims.
        </div>

        <ul>{renderInsuranceProviders()}</ul>
      </section>
    </div>
  );
};

export default PatientSettings;
