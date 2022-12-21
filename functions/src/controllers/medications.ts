import { Medication, InsuranceProvider } from "../types";
import * as medicationsRepo from "../repo/medications";
import * as insuranceRepo from "../repo/insurance";
import * as flexpaGateway from "../gateway/flepxa";

export const getMedicationsByUserUid = async (
  userUid: string
): Promise<Medication[]> => {
  try {
    // const medications: Medication[] = [];

    const medications = await medicationsRepo.getMedicationsByUserUid(userUid);

    // medications.push(...meds);
    // const claimsMedications = await getMedicationsFromInsuranceProvider(
    //   userUid
    // );

    // medications.push(...claimsMedications);
    return medications;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getMedicationsFromInsuranceProvider = async (
  patientUid: string
) => {
  const medications: Medication[] = [];

  // get access tokens by patient uid
  const insuranceMedications =
    await insuranceRepo.getHealthInsuranceProvidersByPatientUid(patientUid);

  for (let i = 0; i < insuranceMedications.length; i++) {
    const insuranceProviderData: InsuranceProvider = insuranceMedications[i];

    // make sure the provider can do medication requests
    if (!insuranceProviderData.capabilities.includes("MedicationRequest"))
      continue;

    const { accessToken } = insuranceProviderData;
    if (!accessToken) throw new Error("Access token cannot be null");

    const refreshedAccessToken = await flexpaGateway.refreshToken(accessToken);

    // save new access token
    await insuranceRepo.updateAccessTokenForInsuranceProvider(
      insuranceProviderData.uid,
      refreshedAccessToken
    );
    const flexpaMedications = await flexpaGateway.getMedicationByAccessToken(
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
  // else authoredOn = new Date(authoredOn);

  const med: Medication = {
    medicationName: display,
    dateStarted: authoredOn,
    source: "CLAIMS",
  };
  return med;
};
