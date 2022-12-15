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
import {
  useRecoilState,
  useSetRecoilState,
  useRecoilValue,
  useRecoilCallback,
} from "recoil";
import { FaPills } from "react-icons/fa";
import { withPrivateRoute } from "./hocs";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { FirebaseContext } from "../firebase/firebase-context";
import { TextInput, DatePicker } from "./common";

const PatientSettings = ({}) => {
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    // openFlexpaLink();
  });

  const openFlexpaLink = () => {
    window.FlexpaLink.open();
  };

  const providers = [{}, {}, {}];
  return (
    <div className="px-2 md:px-28 p-2 md:py-10 flex flex-1 flex-col">
      <section className="mb-16">
        <div className="text-lg font-bold mb-6">Account</div>
        <section className="flex flex-row items-center justify-between border-b">
          <TextInput
            // onChange={onChange}
            name="email"
            // value={medAttrs.medicationName}
            label="Email"
          />
          <button className="font-bold">Edit</button>
        </section>
      </section>
      <section className="mb-6">
        <div className="text-lg font-bold mb-6">Insurance providers</div>
        <section>
          {providers.map((e, i) => {
            return (
              <div className=" border-b">
                <div
                  key={i}
                  className="flex flex-row items-center justify-between my-6 "
                >
                  <div>United healthcare</div>
                  <button className="font-bold">Remove</button>
                </div>
              </div>
            );
          })}
        </section>
      </section>
      <section>
        <button className="p-3 px-8 font-bold border rounded-lg bg-black text-white">
          Add insurance provider
        </button>
      </section>
    </div>
  );
};

export default withPrivateRoute(PatientSettings);
