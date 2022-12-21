import React, { useState, useContext } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import { FirebaseContext } from "../firebase/firebase-context";
import { useNavigate } from "react-router-dom";
import { isLoggingInUserState } from "../recoil/profile/profile";
import { useRecoilValue } from "recoil";
import { withPublicRoute } from "./hocs";
const ProviderSignup = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const [nameValue, setNameValue] = useState("");
  const [emailVal, setEmailVal] = useState("");
  const [passVal, setPassVal] = useState("");
  const [confirmPassVal, setConfirmPassVal] = useState("");
  const isLoggingInUser = useRecoilValue(isLoggingInUserState);

  const { createProvider } = useContext(FirebaseContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createProvider(emailVal, passVal, confirmPassVal, nameValue);

      // setEmailVal("");
      // setPassVal("");
      // setConfirmPassVal("");
      // setNameValue("");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="flex flex-col  flex-1 items-center justify-center ">
      <div className="  w-72 text-center py-2 mb-2  text-gray-600 ">
        Provider Sign up
      </div>
      <div className="  w-72 border-b border-blue-400 mb-4"></div>
      <form onSubmit={handleSubmit}>
        <div className="">
          <input
            disabled={isLoggingInUser}
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            className="border focus:outline-none px-2 py-2 w-72 mb-4"
            placeholder="Name"
          />
        </div>
        <div className="">
          <input
            disabled={isLoggingInUser}
            value={emailVal}
            onChange={(e) => setEmailVal(e.target.value)}
            className="border focus:outline-none px-2 py-2 w-72 mb-4"
            placeholder="Email"
          />
        </div>
        <div>
          <input
            disabled={isLoggingInUser}
            value={passVal}
            onChange={(e) => setPassVal(e.target.value)}
            type="password"
            className="border focus:outline-none px-2 py-2 w-72 mb-4"
            placeholder="Password"
          />
        </div>
        <div>
          <input
            disabled={isLoggingInUser}
            value={confirmPassVal}
            onChange={(e) => setConfirmPassVal(e.target.value)}
            type="password"
            className="border focus:outline-none px-2 py-2 w-72 mb-4"
            placeholder="Confirm password"
          />
        </div>

        {isLoggingInUser ? (
          <div className=" flex flex-row items-center ">
            <div className="animate-spin mr-2">
              <div className=" rounded-full border border-black border-t-0 w-4 h-4"></div>
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
          className="w-72 text-sm text-center border rounded-sm px-3 py-3  text-gray-500 hover:opacity-50"
        >
          Log in to your account
        </button>
      </div>
    </div>
  );
};

export default withPublicRoute(ProviderSignup);
