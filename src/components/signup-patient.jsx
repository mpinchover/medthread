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

const PatientSignup = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const { createPatient } = useContext(FirebaseContext);

  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const isLoggingInUser = useRecoilValue(isLoggingInUserState);
  const authorizedUser = useRecoilValue(authorizedProfileState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPatient(
        emailValue,
        passwordValue,
        confirmPasswordValue,
        nameValue
      );
    } catch (e) {
      console.log(e);

      // setEmailValue("");
      // setPasswordValue("");
      // setConfirmPasswordValue("");
      // setNameValue("");
    }
  };

  return (
    <div className="flex flex-col  flex-1 items-center justify-center ">
      <div className="  w-72 text-center py-2 mb-2  text-gray-600 ">
        Patient Sign up
      </div>
      <div className="  w-72 border-b border-blue-400 mb-4"></div>
      <form onSubmit={handleSubmit}>
        <div className="">
          <input
            disabled={isLoggingInUser}
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            type="name"
            className="border focus:outline-none px-2 py-2 w-72 mb-4"
            placeholder="Name"
          />
        </div>
        <div className="">
          <input
            disabled={isLoggingInUser}
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            type="email"
            className="border focus:outline-none px-2 py-2 w-72 mb-4"
            placeholder="Email"
          />
        </div>
        <div>
          <input
            disabled={isLoggingInUser}
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            type="password"
            className="border focus:outline-none px-2 py-2 w-72 mb-4"
            placeholder="Password"
          />
        </div>
        <div>
          <input
            disabled={isLoggingInUser}
            value={confirmPasswordValue}
            onChange={(e) => setConfirmPasswordValue(e.target.value)}
            type="password"
            className="border focus:outline-none px-2 py-2 w-72 mb-4"
            placeholder="Confirm password"
          />
        </div>
        {isLoggingInUser ? (
          <div className=" flex flex-row items-center ">
            <div className="animate-spin mr-2">
              <div className=" rounded-full border border-blue-200 border-t-blue-400  w-4 h-4"></div>
            </div>
            <span className="text-blue-400">Logging in...</span>
          </div>
        ) : (
          <div className="">
            <button
              onClick={handleSubmit}
              className="w-72 text-sm text-center border rounded-sm px-3 py-3 bg-blue-400 text-white hover:opacity-50"
            >
              Submit
            </button>
          </div>
        )}
      </form>
      <div className="  w-72 border-b border-blue-400 my-4"></div>
      <div className="">
        <button
          disabled={isLoggingInUser}
          onClick={() => navigate("/patient-login")}
          className="w-72 text-sm text-center border rounded-sm px-3 py-3  text-gray-500 hover:opacity-50"
        >
          Log in to your account
        </button>
      </div>
    </div>
  );
};

export default withPublicRoute(PatientSignup);
