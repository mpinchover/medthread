import logo from "./logo.svg";
import "react-toastify/dist/ReactToastify.css";

import app from "./firebase/firebase";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import axios from "axios";

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
import UpdateMedication from "./components/medication-list-update";
import AddMedication from "./components/medication-list-add";
import SendMedications from "./components/send-medications";
import MedicationListProvider from "./components/medication-list-provider";
import { ToastContainer } from "react-toastify";
import Home from "./components/home";
import VerificationPage from "./components/verification-page";
import PatientVerifcationPage from "./components/patient-verification-page";

function App() {
  const [open, setOpen] = useState(null);
  // const [flexpaLink, setFlexpaLink] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [publicToken, setPublicToken] = useState(null);

  const saveRecord = async () => {
    const db = getFirestore();
    const c = collection(db, "cities");
    const docRef = await addDoc(c, {
      name: "Tokyo",
      country: "Japan",
    });

    console.log("Document written with ID: ", docRef.id);
  };

  const getAccessToken = async () => {
    const res = await axios({
      method: "post",
      url: "https://api.flexpa.com/link/exchange",
      data: {
        public_token: publicToken,
        secret_key: "sk_test_cs-s-ZYhDg99z6XMFUQFHAb1Lpm_Sn8zwnlJGb-rlT4",
      },
    });

    setAccessToken(res.data.access_token);
  };

  // function requireAuth(nextState, replace) {
  //   if (!userExists()) {
  //     replace({
  //       pathname: "/signin",
  //       state: { nextPathname: nextState.location.pathname },
  //     });
  //   }
  // }
  function resetHeight() {
    // reset the body height to that of the inner browser
    document.body.style.minHeight = window.innerHeight + "px";
    document.getElementById("root").style.minHeight = window.innerHeight + "px";
  }
  useEffect(() => {
    // reset the height whenever the window's resized
    window.addEventListener("resize", resetHeight);

    // called to initially set the height.
    return () => {
      window.removeEventListener("resize", resetHeight);
    };
  }, []);
  resetHeight();

  return (
    <div className="flex-1 flex flex-col">
      <Router>
        <FirebaseProvider>
          <Navbar />
          <Routes className="">
            <Route exact path="/previous-patients" element={<PatientFeed />} />
            <Route exact path="/active-patient" element={<RecordsFeed />} />

            <Route exact path="/provider-login" element={<ProviderLogin />} />
            <Route exact path="/provider-signup" element={<ProviderSignup />} />
            <Route exact path="/patient-signup" element={<PatientSignup />} />
            <Route exact path="/patient-login" element={<PatientLogin />} />
            <Route exact path="/settings" element={<Settings />} />
            <Route exact path="/forgot-password" element={<ForgotPassword />} />
            <Route exact path="/" element={<Home />} />
            <Route exact path="/update-password" element={<UpdatePassword />} />
            <Route exact path="/add-medication" element={<AddMedication />} />
            <Route exact path="/verification" element={<VerificationPage />} />
            <Route
              exact
              path="/patient-verification"
              element={<PatientVerifcationPage />}
            />
            <Route
              exact
              path="/medication-list-provider"
              element={<MedicationListProvider />}
            />
            <Route
              exact
              path="/update-medication"
              element={<UpdateMedication />}
            />
            <Route
              exact
              path="/patient-homepage"
              element={<PatientHomepage />}
            />
            <Route
              exact
              path="/patient-authorization"
              element={<PatientAuthorizationPage />}
            />
            <Route
              exact
              path="/medication-list-patient"
              element={<PatientMedicationList />}
            />
            <Route
              exact
              path="/send-medications"
              element={<SendMedications />}
            />
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
