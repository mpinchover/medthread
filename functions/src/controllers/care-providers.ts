import * as careProviderRepo from "../repo/care-providers";

export const getAuthorizedHealthcareProviderForPatientRecords = async (
  providerUid: string,
  patientUid: string
) => {
  return await careProviderRepo.getAuthorizedHealthcareProviderForPatient(
    providerUid,
    patientUid
  );
};
