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
import { authorizedProfileState } from "../recoil/auth/auth";

const UpdatePassword = () => {
  const navigate = useNavigate();

  const { updateUserPassword } = useContext(FirebaseContext);

  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");

  const validate = () => {
    if (!passwordValue || passwordValue === "") {
      alert("Password is required");
      return false;
    }
    if (!confirmPasswordValue || confirmPasswordValue === "") {
      alert("Confirm password is required");
      return false;
    }
    if (passwordValue !== confirmPasswordValue) {
      alert("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const v = validate();
      if (!v) return;

      await updateUserPassword(passwordValue);

      navigate("/settings");
    } catch (e) {
      alert("Error creating user");
      console.log(e);
      setPasswordValue("");
      setConfirmPasswordValue("");
    }
  };

  return (
    <div className="flex flex-col  flex-1 items-center justify-center ">
      <div className="  w-72 text-center py-2 mb-2  text-gray-600 ">
        Update password
      </div>
      <div className="  w-72 border-b border-blue-400 mb-4"></div>
      <form onSubmit={handleSubmit}>
        <div className="">
          <input
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            type="password"
            className="border focus:outline-none px-2 py-2 w-72 mb-4"
            placeholder="Password"
          />
        </div>
        <div className="">
          <input
            value={confirmPasswordValue}
            onChange={(e) => setConfirmPasswordValue(e.target.value)}
            type="password"
            className="border focus:outline-none px-2 py-2 w-72 mb-4"
            placeholder="Confirm password"
          />
        </div>
        <div className="mb-4">
          <button
            onClick={handleSubmit}
            type="submit"
            className="w-72 text-sm text-center border rounded-sm px-3 py-3 bg-blue-400 text-white hover:opacity-50"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePassword;
