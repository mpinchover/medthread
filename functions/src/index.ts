import "source-map-support/register";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();
require("dotenv").config();
const cors = require("cors")({ origin: true });
import * as express from "express";
import { addHealthInsuranceProvider } from "./add-health-insurance-provider";
import { getMedicationsByPatientUid } from "./get-medications-by-patient-uid";
const app = express();

// https://firebase.google.com/docs/firestore/query-data/get-data#get_multiple_documents_from_a_collection
app.use(cors);

app.get("/hello", (req, res) => {
  // @ts-ignore
  res.send({ value: process.env.TEST_VALUE });
});

app.post("/get-medications-by-patient-uid", getMedicationsByPatientUid);
app.post("/add-health-insurance-provider", addHealthInsuranceProvider);
exports.app = functions.https.onRequest(app);
