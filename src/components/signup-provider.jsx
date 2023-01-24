import React, { useState, useContext } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { FirebaseContext } from "../firebase/firebase-context";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoggingInUserState } from "../recoil/profile/profile";
import { authorizedProfileState } from "../recoil/auth/auth";
import { withPublicRoute } from "./hocs";
import { TextInput } from "./common";

const ProviderSignup = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const { createProvider } = useContext(FirebaseContext);

  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const isLoggingInUser = useRecoilValue(isLoggingInUserState);
  const authorizedUser = useRecoilValue(authorizedProfileState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const params = {
        emailValue,
        passwordValue,
        confirmPasswordValue,
        nameValue,
      };
      await createProvider(params);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex flex-col  flex-1 items-center justify-center ">
      <div className=" text-2xl w-96 text-center  text-gray-600 ">
        Provider sign up
      </div>
      <div className="  w-96 border-b my-6 border-black"></div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <TextInput
          label="Name"
          disabled={isLoggingInUser}
          onChange={(e) => setNameValue(e.target.value)}
          value={nameValue}
          placeholder="Enter name..."
        />
        <TextInput
          label="Email"
          disabled={isLoggingInUser}
          onChange={(e) => setEmailValue(e.target.value)}
          value={emailValue}
          placeholder="Enter email..."
        />
        <TextInput
          label="Password"
          type="password"
          disabled={isLoggingInUser}
          onChange={(e) => setPasswordValue(e.target.value)}
          value={passwordValue}
          placeholder="Enter password..."
        />
        <TextInput
          label="Confirm password"
          type="password"
          disabled={isLoggingInUser}
          onChange={(e) => setConfirmPasswordValue(e.target.value)}
          value={confirmPasswordValue}
          placeholder="Confirm password..."
        />

        <div className=""></div>
        <div className=""></div>
        <div></div>
        <div></div>
        {isLoggingInUser ? (
          <div className=" flex flex-row items-center ">
            <div className="animate-spin mr-2">
              <div className=" rounded-full border border-black border-t-0 w-4 h-4"></div>
            </div>
            <span className="text-black">Logging in...</span>
          </div>
        ) : (
          <div className="">
            <div className=" w-96">
              <button
                onClick={handleSubmit}
                className="p-3 px-8 font-bold border rounded-lg bg-black text-white"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </form>
      <div className="  w-96 border-b my-6 border-black"></div>
      <div className=" w-96">
        <button
          disabled={isLoggingInUser}
          onClick={() => navigate("/provider-login")}
          className="p-3 px-8 font-bold border rounded-lg "
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default withPublicRoute(ProviderSignup);
