import React from "react";
import { Navigate, useLocation } from "react-router-dom";
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
    const location = useLocation();
    // get the route here and pass it in

    let loginLink = "/patient-login";
    if (location.pathname.includes("provider")) loginLink = "/provider-login";
    const auth = localStorage.getItem("med_thread_auth_user");
    if (!auth) {
      return (
        <Navigate
          to={loginLink}
          replace={true}
          state={{ path: location.pathname }}
        />
      );
    }
    return <Component {...props} />;
  };
  return WrappedComponent;
};
