import { Medication, InsuranceProvider } from "../types";
import * as medicationsRepo from "../repo/medications";
import * as insuranceRepo from "../repo/insurance";
import * as flexpaGateway from "../gateway/flepxa";
// import { fromFlexpaToEntityMedications } from "../mappers/flexpa-to-entity";
// export const getMedicationsByUserUid = async (
//   userUid: string
// ): Promise<Medication[]> => {
//   try {
//     // const medications: Medication[] = [];

//     const medications = await medicationsRepo.getMedicationsByUserUuid(userUid);

//     // medications.push(...meds);
//     // const claimsMedications = await getMedicationsFromInsuranceProvider(
//     //   userUid
//     // );

//     // medications.push(...claimsMedications);
//     return medications;
//   } catch (e) {
//     console.log(e);
//     throw e;
//   }
// };

export const getMedicationsFromInsuranceProvider = async (
  patientUuid: string
) => {
  const medications: Medication[] = [];

  // get access tokens by patient uid
  const insuranceProviders =
    await insuranceRepo.getHealthInsuranceProvidersByPatientUuid(patientUuid);

  for (let i = 0; i < insuranceProviders.length; i++) {
    const insuranceProviderData: InsuranceProvider = insuranceProviders[i];

    // make sure the provider can do medication requests
    if (!insuranceProviderData.capabilities.includes("MedicationRequest")) {
      continue;
    }

    const { accessToken } = insuranceProviderData;
    if (!accessToken) throw new Error("Access token cannot be null");

    const refreshedAccessToken = await flexpaGateway.refreshToken(accessToken);

    // save new access token
    await insuranceRepo.updateAccessTokenForInsuranceProvider(
      insuranceProviderData.uuid,
      refreshedAccessToken
    );
    const flexpaMedications = await flexpaGateway.getMedicationByAccessToken(
      refreshedAccessToken
    );
    // const entityMedications = fromFlexpaToEntityMedications(
    //   flexpaMedications,
    //   insuranceProviderData.uid
    // );
    // medications.push(...entityMedications);
  }
  return medications;
};
