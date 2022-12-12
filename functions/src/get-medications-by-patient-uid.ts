import { getDerivedMedications } from "./repo/repo";
import {
  getHealthInsuranceProvidersByPatientUid,
  updateAccessTokenForInsuranceProvider,
} from "./repo/insurance";

import { getMedicationByAccessToken, refreshToken } from "./gateway/flepxa";
import { Medication, InsuranceProvider } from "./types";
import * as admin from "firebase-admin";

// protect route https://github.com/firebase/functions-samples/blob/main/authorized-https-endpoint/functions/index.js
export const getMedicationsByPatientUid = async (req: any, res: any) => {
  try {
    // const tokenId = req.get("Authorization").split("Bearer ")[1];

    // const decodedToken = await admin.auth().verifyIdToken(tokenId);
    // const patientUid = decodedToken.uid;

    // TODO – change this to use the actual decoded uid fromt he token
    const { patientUid } = req.body;

    let medications: Medication[] = [];
    const patientMedications = await getDerivedMedications(patientUid);
    medications.push(...patientMedications);

    const claimsMedications = await getMedicationsFromInsuranceProvider(
      patientUid
    );
    medications.push(...claimsMedications);
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

export const getMedicationsFromInsuranceProvider = async (
  patientUid: string
) => {
  const medications: Medication[] = [];

  // get access tokens by patient uid
  const insuranceMedications = await getHealthInsuranceProvidersByPatientUid(
    patientUid
  );

  for (let i = 0; i < insuranceMedications.length; i++) {
    const insuranceProviderData: InsuranceProvider = insuranceMedications[i];

    // make sure the provider can do medication requests
    if (!insuranceProviderData.capabilities.includes("MedicationRequest"))
      continue;

    const { accessToken } = insuranceProviderData;
    if (!accessToken) throw new Error("Access token cannot be null");

    const refreshedAccessToken = await refreshToken(accessToken);

    // save new access token
    await updateAccessTokenForInsuranceProvider(
      insuranceProviderData.uid,
      refreshedAccessToken
    );
    const flexpaMedications = await getMedicationByAccessToken(
      refreshedAccessToken
    );
    const entityMedications = fromFlexpaToEntityMedications(flexpaMedications);
    medications.push(...entityMedications);
  }
  return medications;
};

export const fromFlexpaToEntityMedications = (flexpaMedications: any) => {
  if (!flexpaMedications.entry) {
    return [];
  }

  const entityMedications: any[] = [];
  for (let i = 0; i < flexpaMedications.entry.length; i++) {
    const entityMedication = fromFlexpaToEntityMedication(
      flexpaMedications.entry[i]
    );
    entityMedications.push(entityMedication);
  }

  return entityMedications;
};

export const fromFlexpaToEntityMedication = (flexpaMedication: any) => {
  let display =
    flexpaMedication?.resource?.medicationCodeableConcept?.coding[0]?.display;
  let authoredOn = flexpaMedication?.resource?.authoredOn;

  if (!display) display = "UNKNOWN";

  if (!authoredOn) authoredOn = "UNKNOWN";
  else authoredOn = new Date(authoredOn);

  const med: Medication = {
    medicationName: display,
    dateStarted: authoredOn,
    source: "CLAIMS",
  };
  return med;
};
