import * as careProviderRepo from "../repo/care-providers";
import { AuthorizedCareProviderLink, Profile } from "../types";

export const getAuthorizedHealthcareProviderForPatientRecords = async (
  providerUid: string,
  patientUid: string
) => {
  return await careProviderRepo.getAuthorizedHealthcareProviderForPatient(
    providerUid,
    patientUid
  );
};

/*
 – get authorized care providers for this patient
 – you want to also know if their flexpa links need to be refreshed.
 */
export const getPatientsForCareProvider = async (
  careProviderUid: string
): Promise<Profile[]> => {
  const patients = await careProviderRepo.getPatientsByHealthcareProviderUid(
    careProviderUid
  );

  return patients;
};

export const addAuthorizedHealthcareProviderForPatient = async (
  userUid: string,
  careProviderUid: string
): Promise<AuthorizedCareProviderLink> => {
  const authorizedCareProviderLink: AuthorizedCareProviderLink = {
    careProviderUid,
    patientUid: userUid,
  };
  return await careProviderRepo.addAuthorizedHealthcareProviderLink(
    userUid,
    careProviderUid
  );
};
