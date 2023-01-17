import React, { useState, useEffect, useContext } from "react";
import NavbarLoggedOut from "./navbar-logged-out";
import ProviderNavbar from "./navbar-provider";
import PatientNavbar from "./navbar-patient";
import { useRecoilState, useRecoilValue } from "recoil";
import { authorizedProfileState } from "../recoil/auth/auth";
import { FirebaseContext } from "../firebase/firebase-context";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Navbar = () => {
  const [authorizedProfile, setAuthorizedProfile] = useRecoilState(
    authorizedProfileState
  );

  // const auth = getAuth();
  useEffect(() => {
    // const unsubscribe = onAuthStateChanged(auth, async (user) => {
    // _setAuthUser(user);
    // });
    // return unsubscribe;
  }, []);

  // const authUser = getAuthUser();
  const authUser = authorizedProfile;
  console.log("AUTH USER IS");
  console.log(authUser);
  if (authUser && authUser.role === "PATIENT") {
    return <PatientNavbar authUser={authUser} />;
  }

  if (authUser && authUser.role === "PROVIDER") {
    return <ProviderNavbar authUser={authUser} />;
  }

  return <NavbarLoggedOut />;
};
export default Navbar;
