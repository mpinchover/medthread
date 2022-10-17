const functions = require("firebase-functions");
const jwt_decode = require("jwt-decode");
const admin = require("firebase-admin");
const { isRouteErrorResponse } = require("react-router-dom");
admin.initializeApp();
require("dotenv").config();

const cors = require("cors")({ origin: true });
const axios = require("axios");
const express = require("express");
const { getUserProfile } = require("./repo");
const { addAuthorizedHealthcareProvider } = require("./healthcare-providers");
const { addHealthInsuranceProvider } = require("./insurance-provider");
const { sendMedicationsToProvider } = require("./send-medications");
const {
  getPatientMedicationsForProvider,
} = require("./get-patient-medications-for-provider");
const {
  getMedicationsByPatientUid,
} = require("./get-medications-by-patient-uid");
const app = express();

// https://firebase.google.com/docs/firestore/query-data/get-data#get_multiple_documents_from_a_collection
app.use(cors);
app.get("/hello", (req, res) => {
  // @ts-ignore
  res.send(`Hello there`);
});
app.post("/get-medications-by-patient-uid", getMedicationsByPatientUid);
app.post("/get-medications-for-provider", getPatientMedicationsForProvider);

app.post(
  "/add-authorized-healthcare-provider",
  cors,
  addAuthorizedHealthcareProvider
);
app.post("/store-health-insurance-tokens", cors, addHealthInsuranceProvider);
app.post("/send-medications-to-provider", sendMedicationsToProvider);

exports.app = functions.https.onRequest(app);
