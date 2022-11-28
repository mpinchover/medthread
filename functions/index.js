const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
require("dotenv").config();
const { hello } = require("./get-previous-patients");
const cors = require("cors")({ origin: true });
const express = require("express");
const { addHealthInsuranceProvider } = require("./insurance-provider");
const { sendMedicationsToProvider } = require("./send-medications");
const {
  getPatientMedicationsForProvider,
} = require("./get-patient-medications-for-provider");
const { getPreviousPatients } = require("./get-previous-patients");
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
app.get("/hello-app", hello);

app.get("/get-previous-patients", getPreviousPatients);
app.get("/get-medications-by-patient-uid", getMedicationsByPatientUid);
app.post("/get-medications-for-provider", getPatientMedicationsForProvider);

app.post("/store-health-insurance-tokens", addHealthInsuranceProvider);
app.post("/send-medications-to-provider", sendMedicationsToProvider);

exports.app = functions.https.onRequest(app);
