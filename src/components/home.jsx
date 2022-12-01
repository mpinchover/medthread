import { useContext } from "react";
import PreviousPatients from "./previous-patients";
import { FirebaseContext } from "../firebase/firebase-context";
import Settings from "./settings";
import PatientSignup from "./signup-patient";
import { useRecoilValue } from "recoil";
import { authorizedProfileState } from "../recoil/auth/auth";

const Home = () => {
  // const { getAuthUser } = useContext(FirebaseContext);
  // const authUser = getAuthUser();
  const authorizedProfile = useRecoilValue(authorizedProfileState);

  if (!authorizedProfile) return <PatientSignup />;
  const { role } = authorizedProfile;
  if (role === "PROVIDER") return <PreviousPatients />;
  return <Settings />;
};

export default Home;
