import { useContext } from "react";
import PreviousPatients from "./care-provider-patients";
import { FirebaseContext } from "../firebase/firebase-context";
import Settings from "./home/settings";
import PatientSignup from "./signup-patient";
import { useRecoilValue } from "recoil";
import { authorizedProfileState } from "../recoil/auth/auth";
import LoggedOutHome from "./home-logged-out";

const Home = () => {
  // const { getAuthUser } = useContext(FirebaseContext);
  // const authUser = getAuthUser();
  const authorizedProfile = useRecoilValue(authorizedProfileState);

  if (!authorizedProfile) return <LoggedOutHome />;
  const { role } = authorizedProfile;
  if (role === "PROVIDER") return <Settings />;
  return <Settings />;
};

export default Home;
