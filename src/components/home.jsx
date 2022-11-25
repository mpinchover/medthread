import { useContext } from "react";
import PreviousPatients from "./previous-patients";
import { FirebaseContext } from "../firebase/firebase-context";
import Settings from "./settings";

const Home = () => {
  const { getAuthUser } = useContext(FirebaseContext);
  const authUser = getAuthUser();

  if (!authUser) return <div>Not logged in</div>;

  const { role } = authUser;
  if (role === "PROVIDER") return <PreviousPatients />;
  return <Settings />;
};

export default Home;
