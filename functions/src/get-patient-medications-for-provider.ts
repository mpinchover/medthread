import * as admin from "firebase-admin";

import {
  getUserProfile,
  getDerivedMedications,
  // getAuthorizedHealthcareProvider,
} from "./repo/repo";

export const getPatientMedicationsForProvider = async (req: any, res: any) => {
  const { body } = req;
  const { patientUid } = body;
  try {
    const tokenId = req.get("Authorization").split("Bearer ")[1];

    const decodedToken = await admin.auth().verifyIdToken(tokenId);
    const providerUid = decodedToken.uid;

    const providerProfile = await getUserProfile(providerUid);
    if (providerProfile.role !== "PROVIDER") {
      throw new Error("only providers can access patient medical records");
    }

    const authProfile = await admin.auth().getUser(providerUid);
    if (!authProfile.emailVerified) {
      throw new Error("provider must be verified");
    }

    // check to see if this healthcare provider is an authorized provider for this patient
    // const authorizedHealthcareProfileDoc =
    // await getAuthorizedHealthcareProvider(patientUid, authProfile.email);
    // if (!authorizedHealthcareProfileDoc) {
    //   throw new Error("provider not authorized for patient");
    // }

    let medications = await getDerivedMedications(patientUid);
    medications = medications.sort(
      (a, b) =>
        new Date(b.dateStarted).valueOf() - new Date(a.dateStarted).valueOf()
    );
    res.send({ medications });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e });
  }
};

// https://firebase.google.com/docs/auth/admin/manage-users
// token verification https://firebase.google.com/docs/auth/admin/verify-id-tokens
