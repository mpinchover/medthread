import logo from "./logo.svg";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import app from "./firebase/firebase";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { modalState } from "./recoil/utils/utils";
import { useRecoilCallback, useRecoilValue, useRecoilState } from "recoil";
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
import Settings from "./components/home/settings";

import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import MedicationListProvider from "./components/medication-list-provider";
import { ToastContainer } from "react-toastify";
import VerificationPage from "./components/verification-page";
import MedicationListPatient from "./components/medication-list-patient";
import TermsOfService from "./components/terms-of-service";
import PatientTimeline from "./components/patient-timeline";
import Home from "./components/home";
import { accountSettingsState } from "./recoil/account/account";
import GetEmrRecordsModal from "./components/modals/get-emr-records-modal";
import SendMedicationsModal from "./components/medication-modal-send-meds";
import CareProviderPatients from "./components/care-provider-patients";
import AddPatientModal from "./components/modals/add-patient-modal";
const ModalShadow = () => {
  // const { isModalOpen } = useContext(FirebaseContext);
  const modal = useRecoilValue(modalState);

  let style = {};

  // isSendingRecords: false,
  // isSendRecordsModalOpen: false,

  if (modal.isSendRecordsModalOpen || modal.isRequestingEMR) {
    style = {
      background: "rgba(0, 0, 0, 0.5)",
    };
  }
  return (
    <div
      style={style}
      className={`${
        modal.isSendRecordsModalOpen || modal.isRequestingEMR
          ? "absolute"
          : "hidden"
      } h-full w-full z-10`}
    ></div>
  );
};

function App() {
  const [open, setOpen] = useState(null);
  const accountSettings = useRecoilValue(accountSettingsState);
  const [modal, setModal] = useRecoilState(modalState);
  const [accessToken, setAccessToken] = useState(null);
  const [publicToken, setPublicToken] = useState(null);

  const onSendMedications = (e) => {
    e.preventDefault();
    setModal((prevModal) => {
      return {
        ...prevModal,
        isSendRecordsModalOpen: false,
      };
    });
  };

  const onRequestEMR = () => {
    setModal((prevModal) => {
      return {
        ...prevModal,
        isRequestingEMR: false,
      };
    });
  };

  const handleCloseModal = () => {
    setModal((prevModal) => {
      return {
        ...prevModal,
        isSendRecordsModalOpen: false,
        isRequestingEMR: false,
      };
    });
  };

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
  // https://codesandbox.io/s/react-heatmap-grid-xoclz
  //heatmap
  return (
    <div className="flex-1 flex flex-col relative">
      <Router>
        <FirebaseProvider>
          <ModalShadow />
          <Navbar />
          <Routes className="">
            <Route exact path="/patients" element={<CareProviderPatients />} />
            <Route exact path="/active-patient" element={<RecordsFeed />} />

            <Route exact path="/provider-login" element={<ProviderLogin />} />
            <Route exact path="/provider-signup" element={<ProviderSignup />} />
            <Route exact path="/patient-signup" element={<PatientSignup />} />
            <Route exact path="/patient-login" element={<PatientLogin />} />
            <Route exact path="/settings" element={<Settings />} />
            <Route exact path="/forgot-password" element={<ForgotPassword />} />
            <Route
              exact
              path="/patient-timeline"
              element={<PatientTimeline />}
            />
            <Route
              exact
              path="/records/:patientUid"
              element={<MedicationListProvider />}
            />
            <Route exact path="/records" element={<MedicationListPatient />} />
            <Route exact path="/" element={<Home />} />
            <Route
              exact
              path="/terms-of-service"
              element={<TermsOfService />}
            />

            {/* <Route exact path="/update-password" element={<UpdatePassword />} /> */}

            <Route exact path="/verification" element={<VerificationPage />} />
          </Routes>

          <GetEmrRecordsModal
            isOpen={modal?.isRequestingEMR}
            onClose={handleCloseModal}
            onSend={onRequestEMR}
          />
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
