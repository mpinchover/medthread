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
import axios from "axios";
import { getAuth } from "firebase/auth";
import { TextInput, DatePicker, LoadingWindow } from "../common";
import {
  accountUpdateState,
  addInsuranceProviderCallback,
  removeInsuranceProviderCallback,
  isAccountLoadingState,
  isAccountLoadingStateV2,
} from "../../recoil/account/account";

const WelcomePage = ({ authProfile, accountSettings }) => {
  const navigate = useNavigate();
  const auth = getAuth();
  const isAccountLoading = useRecoilValue(isAccountLoadingState);

  const [accountUpdates, setAccountUpdates] =
    useRecoilState(accountUpdateState);

  const addInsuranceProvider = useRecoilCallback(addInsuranceProviderCallback);

  useEffect(() => {
    // set the eamil from the auth profile state
    // make dependencies on email
  }, [auth?.currentUser]);

  window?.FlexpaLink?.create({
    publishableKey: "pk_test_pKDGhsAjAOiDxw6LdHuoogYupzm9VNnQh113WuCoK6I",
    onSuccess: async (publicToken) => {
      addInsuranceProvider(auth, publicToken);
    },
  });

  const openFlexpaLink = () => {
    window.FlexpaLink.open();
  };

  if (isAccountLoading) {
    return <LoadingWindow display={"Loading..."} />;
  }

  return (
    <div className="relative flex flex-1 flex-col text-gray-700">
      <div className=" px-8 md:px-28 py-8 md:py-10 flex flex-1 flex-col">
        <h2 className="text-xl md:text-3xl">
          Thank you for participating in the MedThread x The Lanby pilot
          program.
        </h2>
        <p className="md:text-lg mt-3">
          Please add both your previous & current insurance provider(s) to allow
          us to gather your medical history. You can add as many as you'd like.
        </p>

        <section className="mt-12">
          <section>
            {accountSettings?.insuranceProviders?.map((element, i) => {
              return (
                <div key={i} className=" border-b last:border-none ">
                  <div
                    key={i}
                    className="relative flex flex-row items-center justify-between my-6 "
                  >
                    <div>
                      {element.providerName ? element.providerName : "UNKNOWN"}
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
          <section className="">
            <button
              onClick={openFlexpaLink}
              className="w-full md:w-auto p-3 px-6 font-bold border rounded-lg bg-cyan-600 text-gray-100"
            >
              Add insurance provider
            </button>
          </section>
        </section>
      </div>

      <section className=" text-sm px-8 md:px-28 text-gray-300 py-4 md:py-10 bottom-0 bg-gradient-to-r from-cyan-600 to-[#0867b2] w-full absolute">
        <section className="">
          <p>
            MedThread is a HIPAA complaint organization that helps your provider
            understand your health history. We do not sell / share your data. No
            one else will have access to your data. Your data is not sold to any
            third parties.
          </p>
        </section>
      </section>
    </div>
  );
};

export default withPrivateRoute(WelcomePage);
