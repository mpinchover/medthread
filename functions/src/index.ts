import "source-map-support/register";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();
require("dotenv").config();
const cors = require("cors")({ origin: true });
import * as express from "express";
import { addHealthInsuranceProvider } from "./add-health-insurance-provider";
import { getUserAccount } from "./get-user-account";
import { removeHealthInsuranceProvider } from "./remove-health-insurance-provider";
// import { getMedicationsByPatientUid } from "./get-medications-by-patient-uid";
const app = express();

// https://firebase.google.com/docs/firestore/query-data/get-data#get_multiple_documents_from_a_collection
app.use(cors);

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const validateFirebaseIdToken = async (req: any, res: any, next: any) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")
    ) {
      res.status(403).send("Unauthorized");
      return;
    }

    const headerToken = req.headers?.authorization;
    if (!headerToken) throw new Error();
    const idToken = req.headers.authorization.split("Bearer ")[1];
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedIdToken;
    next();
    return;
  } catch (e) {
    res.status(403).send("Unauthorized");
    return;
  }
};

// app.get("/hello", (req, res) => {
//   // @ts-ignore
//   res.send({ value: process.env.TEST_VALUE });
// });

// app.post(
//   "/get-medications-by-patient-uid"
//   // validateFirebaseIdToken,
//   // getMedicationsByPatientUid
// );
app.post(
  "/add-health-insurance-provider",
  validateFirebaseIdToken,
  addHealthInsuranceProvider
);
app.post(
  "/remove-health-insurance-provider",
  validateFirebaseIdToken,
  removeHealthInsuranceProvider
);
app.get("/get-user-account", validateFirebaseIdToken, getUserAccount);
exports.app = functions.https.onRequest(app);
