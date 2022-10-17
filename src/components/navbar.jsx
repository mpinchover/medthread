import React, { useState, useEffect, useContext } from "react";
import NavbarLoggedOut from "./navbar-logged-out";
import ProviderNavbar from "./navbar-provider";
import PatientNavbar from "./navbar-patient";
import { useRecoilState, useRecoilValue } from "recoil";
import { authorizedProfileState } from "../recoil/auth/auth";
import { FirebaseContext } from "../firebase/firebase-context";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Navbar = () => {
  const [_authUser, _setAuthUser] = useState(null);
  const { getAuthUser } = useContext(FirebaseContext);
  const v = useRecoilValue(authorizedProfileState);
  const auth = getAuth();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      _setAuthUser(user);
    });
    return unsubscribe;
  }, []);

  const authUser = getAuthUser();

  if (authUser && authUser.role === "PATIENT") {
    return <PatientNavbar />;
  }
  if (authUser && authUser.role === "PROVIDER") {
    return <ProviderNavbar />;
  }
  return <NavbarLoggedOut />;

  return <div></div>;
};
export default Navbar;
