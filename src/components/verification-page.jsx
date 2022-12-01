import { FirebaseContext } from "../firebase/firebase-context";
import { useContext, useEffect, useState } from "react";
import { withPrivateRoute } from "./hocs";
import { authorizedProfileState } from "../recoil/auth/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { useRecoilValue, useRecoilState } from "recoil";
import { onIdTokenChanged, onAuthStateChanged, getAuth } from "firebase/auth";

const VerificationPage = () => {
  const [authorizedProfile, setAuthorizedProfile] = useRecoilState(
    authorizedProfileState
  );

  const { verifyEmailAddress } = useContext(FirebaseContext);
  const navigate = useNavigate();
  useEffect(() => {
    const auth = getAuth();
  }, []);

  if (!authorizedProfile || authorizedProfile?.emailVerified) {
    console.log(authorizedProfile);
    return <Navigate to="/" replace={true} />;
  }

  const { email } = authorizedProfile;

  return (
    <div className="flex flex-col  flex-1 items-center justify-center ">
      <div>Please verify your email address {email}</div>
      <button onClick={verifyEmailAddress} className="text-blue-400">
        Send verification link
      </button>
    </div>
  );
};

export default VerificationPage;
