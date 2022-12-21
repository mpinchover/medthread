import logo from "./logo.svg";
import "react-toastify/dist/ReactToastify.css";

import app from "./firebase/firebase";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useRecoilCallback } from "recoil";
import { FirebaseProvider } from "./firebase/firebase-context";
import Navbar from "./components/navbar";
import RecordsFeed from "./components/active-patient";
import PatientFeed from "./components/patient-feed";
import ProviderLogin from "./components/login-provider";
import PatientLogin from "./components/login-patient";
// import PatientSignup from "./components/patient-signup";
import ProviderSignup from "./components/signup-provider";
import PatientHomepage from "./components/homepage-patient";
import PatientAuthorizationPage from "./components/patient-authorization-page";
import PatientSignup from "./components/signup-patient";
import ForgotPassword from "./components/forgot-password";
import Settings from "./components/settings";
import PatientMedicationList from "./components/medication-list-patient";
import UpdatePassword from "./components/settings-password-update";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import SendMedications from "./components/send-medications";
import MedicationListProvider from "./components/medication-list-provider";
import { ToastContainer } from "react-toastify";
import Home from "./components/home";
import VerificationPage from "./components/verification-page";
import { FirebaseContext } from "./firebase/firebase-context";
import MedicationListPatient from "./components/medication-list-patient";

const ModalShadow = () => {
  const { isModalOpen } = useContext(FirebaseContext);

  let style = {};
  if (isModalOpen) {
    style = {
      background: "rgba(0, 0, 0, 0.5)",
    };
  }
  return (
    <div
      style={style}
      className={`${isModalOpen ? "absolute" : "hidden "} h-full w-full z-20`}
    ></div>
  );
};

function App() {
  const [open, setOpen] = useState(null);

  const [accessToken, setAccessToken] = useState(null);
  const [publicToken, setPublicToken] = useState(null);

  function resetHeight() {
    // reset the body height to that of the inner browser
    document.body.style.minHeight = window.innerHeight + "px";
    document.getElementById("root").style.minHeight = window.innerHeight + "px";
  }
  useEffect(() => {
    window.addEventListener("resize", resetHeight);

    return () => {
      window.removeEventListener("resize", resetHeight);
    };
  }, []);
  resetHeight();

  return (
    <div className="flex-1 flex flex-col relative">
      <Router>
        <FirebaseProvider>
          <ModalShadow />
          <Navbar />
          <Routes className="">
            <Route exact path="/previous-patients" element={<PatientFeed />} />
            <Route exact path="/active-patient" element={<RecordsFeed />} />

            <Route exact path="/provider-login" element={<ProviderLogin />} />
            <Route exact path="/provider-signup" element={<ProviderSignup />} />
            <Route exact path="/signup" element={<PatientSignup />} />
            <Route exact path="/login" element={<PatientLogin />} />
            <Route exact path="/settings" element={<Settings />} />
            <Route exact path="/forgot-password" element={<ForgotPassword />} />
            <Route exact path="/" element={<MedicationListPatient />} />
            {/* <Route exact path="/update-password" element={<UpdatePassword />} /> */}

            {/* <Route exact path="/verification" element={<VerificationPage />} /> */}
          </Routes>

          <ToastContainer />
        </FirebaseProvider>
      </Router>

      {/* <RecordsFeed /> */}
      {/* <PatientFeed /> */}
      {/* <h1 className="text-3xl text-center font-bold underline text-red-400">
        Hello world!
      </h1>

      <TextComponent></TextComponent>
      <button onClick={saveRecord}>This button</button>
      <div>
        <button onClick={() => flexpaLink.open()}>Click for flexpa</button>
      </div>
      <div>
        <button onClick={getAccessToken}> get access token</button>
      </div>
      <div>
        <button onClick={getMedRecords}>get meds</button>
      </div> */}
    </div>
  );
}

export default App;

// creds
// https://www.flexpa.com/docs/getting-started/test-mode
// procedure, personal information, medications, immunizations, allergies
