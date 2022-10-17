import React from "react";
import { Navigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authorizedProfileState } from "../recoil/auth/auth";

export const PrivateRoute = ({ children }) => {
  const [auth, setAuth] = useRecoilState(authorizedProfileState);

  if (!auth || auth.user === "NOT_AUTHORIZED") {
    return <Navigate to="/patient-login" />;
  }
  return <>{children}</>;
};

export const withPrivateRoute = (Component) => {
  const WrappedComponent = (props) => {
    const auth = localStorage.getItem("med_thread_auth_user");
    if (!auth) {
      return <Navigate to="/patient-login" />;
    }
    return <Component {...props} />;
  };
  return WrappedComponent;
};
