import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authorizedProfileState } from "../recoil/auth/auth";
import { FirebaseContext } from "../firebase/firebase-context";

const ProviderLogin = () => {
  const navigate = useNavigate();
  const [_authProfile, _setAuthProfile] = useRecoilState(
    authorizedProfileState
  );
  const [emailVal, setEmailVal] = useState("");
  const [passwordVal, setPasswordVal] = useState("");

  const validate = () => {
    if (!emailVal || emailVal === "") {
      alert("Email required");
      return false;
    }
    if (!passwordVal || passwordVal === "") {
      alert("Password required");
      return false;
    }
    return true;
  };

  const { signIn } = useContext(FirebaseContext);
  const handleSubmit = (e) => {
    signIn(emailVal, passwordVal);
  };

  return (
    <div className="flex flex-col  flex-1 items-center justify-center ">
      <div className="  w-72 text-center py-2 mb-2  text-gray-600 ">
        Provider Portal Login
      </div>
      <div className="  w-72 border-b border-blue-400 mb-4"></div>
      <div className="">
        <input
          value={emailVal}
          onChange={(e) => setEmailVal(e.target.value)}
          className="border focus:outline-none px-2 py-2 w-72 mb-4"
          placeholder="Email"
        />
      </div>
      <div>
        <input
          value={passwordVal}
          onChange={(e) => setPasswordVal(e.target.value)}
          type="password"
          className="border focus:outline-none px-2 py-2 w-72 mb-4"
          placeholder="Password"
        />
      </div>
      <div className="mb-4">
        <button
          onClick={handleSubmit}
          className="w-72 text-sm text-center border rounded-sm px-3 py-3 bg-blue-400 text-white hover:opacity-50"
        >
          Submit
        </button>
      </div>
      <div className="mb-4">
        <button
          onClick={() => navigate("/forgot-password")}
          className="w-72 text-sm   text-left  text-gray-400 hover:opacity-50"
        >
          Forgot password?
        </button>
      </div>
      <div className="  w-72 border-b border-blue-400 mb-4"></div>
      <div className="">
        <button
          onClick={() => navigate("/provider-signup")}
          className="w-72 text-sm text-center border rounded-sm px-3 py-3  text-gray-500 hover:opacity-50"
        >
          Sign up for an account
        </button>
      </div>
    </div>
  );
};

export default ProviderLogin;
