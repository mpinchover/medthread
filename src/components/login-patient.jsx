import React, { useState, useContext } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { authorizedProfileState } from "../recoil/auth/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseContext } from "../firebase/firebase-context";
import { isLoggingInUserState } from "../recoil/profile/profile";

const PatientLogin = (props) => {
  const location = useLocation();

  const navigate = useNavigate();
  const { signIn, sendResetPasswordEmail } = useContext(FirebaseContext);
  const [emailVal, setEmailVal] = useState("");
  const [passwordVal, setPasswordVal] = useState("");
  const [navigationLink, setNavigationLink] = useState(location?.state?.path);
  const isLoggingInUser = useRecoilValue(isLoggingInUserState);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();

    if (!v) return;
    await signIn(emailVal, passwordVal);

    const link = location?.state?.path ? location?.state?.path : "/";

    navigate(navigationLink ? navigationLink : "/");
  };
  return (
    <div className="flex flex-col  flex-1 items-center justify-center ">
      <div className=" w-72 text-center py-2 mb-2">Patient Portal Login</div>
      <div className="  w-72   border-b border-blue-400 mb-4"></div>
      <form onSubmit={handleSubmit}>
        <div className="">
          <input
            type="email"
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

      <div className="mb-4">
        <button
          onClick={() => navigate("/forgot-password")}
          className="w-72 text-sm   text-left  text-gray-400 hover:opacity-50"
        >
          Forgot password?
        </button>
      </div>

      <div className="">
        <button
          onClick={() => navigate("/patient-signup")}
          className="w-72 text-sm text-center border rounded-sm px-3 py-3  text-gray-500 hover:opacity-50"
        >
          Sign up for an account
        </button>
      </div>
    </div>
  );
};

export default PatientLogin;
