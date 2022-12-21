const admin = require("firebase-admin");
const axios = require("axios");
const { getUserProfile } = require("./repo");

const _getPatientMedicationsByPatientUid = async (req, res) => {
  try {
    // get user id
    const tokenId = req.get("Authorization").split("Bearer ")[1];

    const decodedToken = await admin.auth().verifyIdToken(tokenId);
    const userUid = decodedToken.uid;

    // first get their access tokens by the patient uid
    const patientProfile = await getUserProfile(userUid);

    if (!patientProfile || !patientProfile)
      throw new Error(
        "no insurance profile found for user with uid " + userUid
      );
    // TODO – optimize to run in parallel.
    const results = {};
    for (let insurance_provider in patientProfile.insurance_providers) {
      const accessToken =
        patientProfile.insurance_providers[insurance_provider].access_token;

      let meds = await getMedicationByAccessToken(accessToken);

      if (meds && meds.entry && meds.entry.length > 0) {
        meds = processFlexpaMedicationsResponse(meds);
        results[insurance_provider] = meds;
      }
    }
    res.send({ data: results });
  } catch (e) {
    const { data, code } = e;
    console.log(e);
    res.status(500).send({
      code,
      data,
    });
  }
};

const getMedicationByAccessToken = async (accessToken) => {
  const res = await axios.get("https://api.flexpa.com/fhir/MedicationRequest", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

const processFlexpaMedicationsResponse = (flexpaMedicationsResponse) => {
  const { entry } = flexpaMedicationsResponse;
  const results = [];
  for (let i = 0; i < entry.length; i++) {
    const flexpaMedicationResponse = entry[i];

    const processedFlexpaMedicationEntry = processFlexpaMedicationResponse(
      flexpaMedicationResponse
    );

    results.push(processedFlexpaMedicationEntry);
  }
  return results;
};

const processFlexpaMedicationResponse = (flexpaMedication) => {
  let med = {};

  const { resource } = flexpaMedication;

  if (!resource) return null;

  let {
    status,
    intent,
    medicationCodeableConcept,
    authoredOn,
    requester,
    dosageInstruction,
    dispenseRequest,
  } = resource;

  if (
    medicationCodeableConcept &&
    medicationCodeableConcept.coding &&
    medicationCodeableConcept.coding.length > 0 &&
    medicationCodeableConcept.coding[0].display
  ) {
    med.medicationname = medicationCodeableConcept.coding[0].display;
  } else {
    med.medicationname = "UNKNOWN";
  }

  if (requester && requester.display) {
    med.requesterName = requester.display;
  } else {
    med.requesterName = "UNKNOWN";
  }

  if (
    dosageInstruction &&
    dosageInstruction.length > 0 &&
    dosageInstruction[0].text
  ) {
    med.medicationType = dosageInstruction[0].text;
  } else {
    med.medicationType = "UNKNOWN";
  }

  if (
    dosageInstruction &&
    dosageInstruction.length > 0 &&
    dosageInstruction[0].doseAndRate &&
    dosageInstruction[0].doseAndRate.length > 0 &&
    dosageInstruction[0].doseAndRate[0].value
  ) {
    med.medicationDoseValue = dosageInstruction[0].doseAndRate[0].value;
  } else {
    med.medicationDoseValue = "UNKNOWN";
  }

  if (
    dosageInstruction &&
    dosageInstruction.length > 0 &&
    dosageInstruction[0].doseAndRate &&
    dosageInstruction[0].doseAndRate.length > 0 &&
    dosageInstruction[0].doseAndRate[0].doseQuantity &&
    dosageInstruction[0].doseAndRate[0].doseQuantity.unit
  ) {
    med.medicationDoseUnit =
      dosageInstruction[0].doseAndRate[0].doseQuantity.unit;
  } else {
    med.medicationDoseUnit = "UNKNOWN";
  }

  if (
    dispenseRequest &&
    dispenseRequest.quantity &&
    dispenseRequest.quantity.value
  ) {
    med.medicationDispensedQuantity = dispenseRequest.quantity.value;
  } else {
    med.medicationDispensedQuantity = "UKNOWN";
  }

  if (!status) status = "UNKNOWN";

  if (!authoredOn) authoredOn = "UNKNOWN";

  if (!intent) intent = "UNKNOWN";

  return med;
};

module.exports = {
  processFlexpaMedicationsResponse,
  getPatientMedicationsByPatientUid,
};
