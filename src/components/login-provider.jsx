import React, { useState, useContext } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { authorizedProfileState } from "../recoil/auth/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseContext } from "../firebase/firebase-context";
import { isLoggingInUserState } from "../recoil/profile/profile";
import { withPublicRoute } from "./hocs";
import { TextInput } from "./common";

const ProviderLogin = (props) => {
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
      <div className="text-bold text-2xl w-72 text-center ">Provider login</div>
      <div className="  w-96   border-b border-black my-6"></div>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
        <TextInput
          value={emailVal}
          onChange={(e) => setEmailVal(e.target.value)}
          label="Email"
          placeholder="Enter email..."
        />
        <TextInput
          onChange={(e) => setPasswordVal(e.target.value)}
          value={passwordVal}
          label="Password"
          type="password"
          placeholder="Enter password..."
        />
        {isLoggingInUser ? (
          <div className=" flex flex-row items-center ">
            <div className="animate-spin mr-2">
              <div className=" rounded-full border border-black border-t-0  w-4 h-4"></div>
            </div>
            <span className="text-black">Logging in...</span>
          </div>
        ) : (
          <div className="">
            <button
              onClick={handleSubmit}
              className="p-3 px-8 font-bold border rounded-lg bg-black text-white"
            >
              Submit
            </button>
          </div>
        )}
      </form>
      <div className="  w-96   border-b border-black my-6"></div>
      {/* <div className="  w-72 border-b border-blue-400 my-4"></div> */}

      <div className="mb-6 w-96">
        <button
          onClick={() => navigate("/forgot-password")}
          className=" text-sm   text-left  text-black hover:opacity-50"
        >
          Forgot password?
        </button>
      </div>

      <div className=" w-96">
        <button
          onClick={() => navigate("/provider-signup")}
          className="p-3 px-8 font-bold border rounded-lg"
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default withPublicRoute(ProviderLogin);
