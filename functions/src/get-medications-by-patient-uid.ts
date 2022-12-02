import { getDerivedMedications } from "./repo/repo";
import * as admin from "firebase-admin";

// protect route https://github.com/firebase/functions-samples/blob/main/authorized-https-endpoint/functions/index.js
export const getMedicationsByPatientUid = async (req: any, res: any) => {
  try {
    const tokenId = req.get("Authorization").split("Bearer ")[1];

    const decodedToken = await admin.auth().verifyIdToken(tokenId);
    const patientUid = decodedToken.uid;

    let medications = await getDerivedMedications(patientUid);
    medications = medications.sort(
      (a, b) =>
        new Date(b.dateStarted).valueOf() - new Date(a.dateStarted).valueOf()
    );
    res.send({ medications });
  } catch (e) {
    console.log(e);
    res.status(501).send({ error: e });
  }
};
