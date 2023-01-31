import { FaPen, FaPlus, FaMinusCircle } from "react-icons/fa";
import { AiOutlinePlus, AiOutlineSend } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";

import {
  useRecoilState,
  useSetRecoilState,
  useRecoilValue,
  useRecoilCallback,
} from "recoil";

import { FaPills } from "react-icons/fa";
import { withPrivateRoute } from "../hocs";
import { getAuth } from "firebase/auth";
import { FirebaseContext } from "../../firebase/firebase-context";
import { TextInput, DatePicker, LoadingWindow } from "../common";
import {
  accountUpdateState,
  addInsuranceProviderCallback,
  removeInsuranceProviderCallback,
  isAccountLoadingState,
  isAccountLoadingStateV2,
} from "../../recoil/account/account";

const PatientSettings = ({ authProfile, accountSettings }) => {
  const navigate = useNavigate();
  const auth = getAuth();
  const { updateUserPassword, updateUserEmail } = useContext(FirebaseContext);
  const isAccountLoading = useRecoilValue(isAccountLoadingState);

  const [accountUpdates, setAccountUpdates] =
    useRecoilState(accountUpdateState);

  const [passwordValue, setPasswordValue] = useState("somepassword");
  const [email, setEmail] = useState(authProfile.email);
  const [activeRemoveInsuranceUid, setActiveRemoveInsuranceUid] = useState("");

  const addInsuranceProvider = useRecoilCallback(addInsuranceProviderCallback);
  const removeInsuranceProvider = useRecoilCallback(
    removeInsuranceProviderCallback
  );

  useEffect(() => {
    // set the eamil from the auth profile state
    // make dependencies on email
  });

  window?.FlexpaLink?.create({
    publishableKey: "pk_test_pKDGhsAjAOiDxw6LdHuoogYupzm9VNnQh113WuCoK6I",
    onSuccess: async (publicToken) => {
      addInsuranceProvider(publicToken);
    },
  });

  const openFlexpaLink = () => {
    window.FlexpaLink.open();
  };

  const handleSaveEmail = (e) => {
    updateUserEmail(email);
  };

  const handleSavePassword = (e) => {
    updateUserPassword(passwordValue);
    setPasswordValue("somepassword");
  };

  const handleClick = (e) => {
    const name = e.target.name;
    const val = e.target.value;

    if (name === "EDIT_EMAIL") {
      setAccountUpdates({
        ...accountUpdates,
        isUpdatingEmail: true,
      });
    } else if (name === "CANCEL_EMAIL") {
      setAccountUpdates({
        ...accountUpdates,
        isUpdatingEmail: false,
      });
      setEmail(authProfile.email);
    } else if (name === "EDIT_PASSWORD") {
      setAccountUpdates({
        ...accountUpdates,
        isUpdatingPassword: true,
      });
      setPasswordValue("");
    } else if (name === "CANCEL_PASSWORD") {
      setPasswordValue("somepassword");
      setAccountUpdates({
        ...accountUpdates,
        isUpdatingPassword: false,
      });
    }
  };

  const renderInsuranceProviders = () => {
    return (
      <>
        <section className="mb-6">
          <div className="text-xl md:text-3xl font-bold  ">
            Insurance providers
          </div>
          <a
            target="_blank"
            className="text-blue-500 font-bold"
            href="https://www.youtube.com/watch?v=np0UVYlnWGw"
          >
            See example
          </a>

          <section>
            {accountSettings?.insuranceProviders?.map((element, i) => {
              return (
                <div key={i} className=" border-b ">
                  <div
                    key={i}
                    className="relative flex flex-row items-center justify-between my-6 "
                  >
                    <div>
                      {element.providerName ? element.providerName : "UNKNOWN"}
                    </div>
                    {/* <div>
                {activeRemoveInsuranceUid === element.uid ? (
                  <>
                    <button
                      onClick={() => handleRemoveInsuranceProvider(element)}
                      className=" font-bold"
                    >
                      Yes
                    </button>
                    <span className="mx-2">|</span>
                    <button
                      onClick={() => setActiveRemoveInsuranceUid(null)}
                      className="font-bold"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setActiveRemoveInsuranceUid(element.uid)}
                    className="font-bold"
                  >
                    Remove
                  </button>
                )}
              </div> */}
                  </div>
                </div>
              );
            })}
          </section>
        </section>
        <section>
          <button
            onClick={openFlexpaLink}
            className="w-full md:w-auto p-3 px-6 font-bold border rounded-lg bg-black text-white"
          >
            Add insurance provider
          </button>
        </section>
      </>
    );
  };

  if (isAccountLoading) {
    return <LoadingWindow display={"Loading..."} />;
  }

  return (
    <div className="px-8 md:px-28 py-8 md:py-10 flex flex-1 flex-col">
      <section className="mb-16">
        <div className="text-xl md:text-3xl font-bold mb-6 ">Account</div>
        <section className=" flex flex-col space-y-6">
          <section className="m-0 flex flex-row justify-between items-center">
            <TextInput
              disabled={!accountUpdates.isUpdatingEmail}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              value={email}
              label="Email"
            />
            {accountUpdates.isUpdatingEmail ? (
              <div className="ml-4 space-x-2 flex flex-row">
                <button
                  name={"CANCEL_EMAIL"}
                  onClick={handleClick}
                  className=" font-bold"
                >
                  Cancel
                </button>
                <div className="border-l h-[20px] border-black"></div>
                <button
                  name={"SAVE_EMAIL"}
                  onClick={handleSaveEmail}
                  className=" font-bold"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                name={"EDIT_EMAIL"}
                onClick={handleClick}
                className=" font-bold"
              >
                Edit
              </button>
            )}
          </section>
        </section>
        <div className="border-b my-6"></div>

        <section className=" flex flex-col space-y-6">
          <section className="m-0 flex flex-row justify-between items-center">
            <TextInput
              disabled={!accountUpdates.isUpdatingPassword}
              onChange={(e) => setPasswordValue(e.target.value)}
              name="password"
              type={accountUpdates.isUpdatingPassword ? "text" : "password"}
              value={
                accountUpdates.isUpdatingPassword
                  ? passwordValue
                  : "somepassword"
              }
              label={
                accountUpdates.isUpdatingPassword ? "New password" : "password"
              }
            />
            {accountUpdates.isUpdatingPassword ? (
              <div className="ml-4 space-x-2 flex flex-row">
                <button
                  name={"CANCEL_PASSWORD"}
                  onClick={handleClick}
                  className=" font-bold"
                >
                  Cancel
                </button>
                <div className="border-l h-[20px] border-black"></div>
                <button
                  name="SAVE_PASSWORD"
                  onClick={handleSavePassword}
                  className=" font-bold"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                name={"EDIT_PASSWORD"}
                onClick={handleClick}
                className=" font-bold"
              >
                Edit
              </button>
            )}
          </section>
        </section>
      </section>
      {authProfile.role === "PATIENT" && renderInsuranceProviders()}
    </div>
  );
};

export default withPrivateRoute(PatientSettings);
