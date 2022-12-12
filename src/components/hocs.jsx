import { getAuth } from "firebase/auth";
import React from "react";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { authorizedProfileState } from "../recoil/auth/auth";

export const withPublicRoute = (Component) => {
  const WrappedComponent = (props) => {
    const location = useLocation();
    const authorizedProfile = useRecoilValue(authorizedProfileState);

    const patientAllowed = () => {
      if (authorizedProfile) return true;
      return false;
    };

    const providerAllowed = () => {
      if (authorizedProfile && authorizedProfile.emailVerified) return true;
      return false;
    };

    const isLoginRoute = () => {
      return (
        location.pathname.includes("verification") ||
        location.pathname.includes("signup") ||
        location.pathname.includes("login")
      );
    };

    if (isLoginRoute() && (providerAllowed() || patientAllowed())) {
      return <Navigate to="/" replace={true} />;
    }

    return <Component {...props} />;
  };
  return WrappedComponent;
};

export const withPrivateRoute = (Component) => {
  const WrappedComponent = (props) => {
    const location = useLocation();
    const authorizedProfile = useRecoilValue(authorizedProfileState);

    let loginLink = "/patient-login";
    if (location.pathname.includes("provider")) loginLink = "/provider-login";

    if (
      authorizedProfile &&
      authorizedProfile.role === "PROVIDER" &&
      !authorizedProfile.emailVerified
    ) {
      return <Navigate to="/verification" replace={true} />;
    }

    // if (!authorizedProfile) {
    //   return (
    //     <Navigate
    //       to={loginLink}
    //       replace={true}
    //       state={{ path: location.pathname }}
    //     />
    //   );
    // }
    return <Component {...props} />;
  };
  return WrappedComponent;
};
