import { useContext } from "react";
import PreviousPatients from "./previous-patients";
import { FirebaseContext } from "../firebase/firebase-context";
import Settings from "./settings";
import PatientSignup from "./signup-patient";

const Home = () => {
  const { getAuthUser } = useContext(FirebaseContext);
  const authUser = getAuthUser();

  if (!authUser) return <PatientSignup />;
  const { role } = authUser;
  if (role === "PROVIDER") return <PreviousPatients />;
  return <Settings />;
};

export default Home;
