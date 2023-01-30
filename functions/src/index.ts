import "source-map-support/register";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();
admin.firestore().settings({ ignoreUndefinedProperties: true });
require("dotenv").config();
const cors = require("cors")({ origin: true });
import * as express from "express";
import { addHealthInsuranceProvider } from "./add-health-insurance-provider";
import { getUserAccount } from "./get-user-account";
// import { removeHealthInsuranceProvider } from "./remove-health-insurance-provider";
// import { saveMedication } from "./save-medication";
// // import { getMedicationsByUserUid } from "./get-medications-by-user-uid";
// import { removeMedication } from "./remove-medication";
// import { sendMedicationsToProvider } from "./send-medications";
import { getClaimsDataByUserUid } from "./handlers/get-claims-data-by-user-uid";
import { createHydratedUserProfile } from "./handlers/create-hydrated-user";
import { getClaimsDataByUserUidForProvider } from "./handlers/get-claims-data-by-user-uid-for-provider";
import { getPatientTimelineData } from "./handlers/get-patient-timeline";
import { hydrateUserProfile } from "./handlers/hydrate-user-profile";
import { getPatientTimelineDataForProvider } from "./handlers/get-patient-timeline-for-provider";
import { getPatientsByHealthcareProviderUid } from "./handlers/get-patients-by-healthcare-provider-uid";
import { sendRequestForEMRDataForEOBEvent } from "./handlers/send-request-for-emr-data-for-eob-event";
import { testFn } from "./repo/repo";
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
    req.auth = decodedIdToken;
    next();
    return;
  } catch (e) {
    res.status(403).send("Unauthorized");
    return;
  }
};

app.post(
  "/get-patients-by-healthcare-provider-uid",
  validateFirebaseIdToken,
  getPatientsByHealthcareProviderUid
);

app.post(
  "/add-health-insurance-provider",
  validateFirebaseIdToken,
  addHealthInsuranceProvider
);

app.post(
  "/get-patient-timeline-data-for-provider",
  validateFirebaseIdToken,
  getPatientTimelineDataForProvider
);

app.post(
  "/get-patient-timeline-data",
  validateFirebaseIdToken,
  getPatientTimelineData
);

app.post(
  "/get-claims-data-by-user-uid",
  validateFirebaseIdToken,
  getClaimsDataByUserUid
);

app.post("/create-hydrated-profile", createHydratedUserProfile);

app.post(
  "/get-claims-data-by-user-uid-for-provider",
  validateFirebaseIdToken,
  getClaimsDataByUserUidForProvider
);

app.post("/hydrate-user-profile", validateFirebaseIdToken, hydrateUserProfile);
// app.post(
//   "/remove-health-insurance-provider",
//   validateFirebaseIdToken,
//   removeHealthInsuranceProvider
// );
app.post(
  "/send-request-for-emr-data-for-eob-event",
  validateFirebaseIdToken,
  sendRequestForEMRDataForEOBEvent
);

// app.post("/remove-medication", validateFirebaseIdToken, removeMedication);
// app.post("/save-medication", validateFirebaseIdToken, saveMedication);
app.post("/get-user-account", validateFirebaseIdToken, getUserAccount);
// app.get(
//   "/get-medications-by-user-uid",
//   validateFirebaseIdToken,
//   getMedicationsByUserUid
// );

app.get("/test-fn", async (req: any, res: any) => {
  try {
    await testFn();
    res.send({ success: "success" });
  } catch (e) {
    console.log(e);
    res.status(501).send({ error: e });
  }
});

const runtimeOpts = {
  timeoutSeconds: 300,
  // memory: "1GB",
};
exports.app = functions.runWith(runtimeOpts).https.onRequest(app);
