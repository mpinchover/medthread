import * as careProviderRepo from "../repo/care-providers";
import { AuthorizedCareProviderLink, Profile } from "../types";
import { v4 } from "uuid";

export const getAuthorizedHealthcareProviderForPatientRecords = async (
  authUid: string,
  providerUuid: string,
  patientUuid: string
) => {
  return await careProviderRepo.getAuthorizedHealthcareProviderForPatient(
    authUid,
    providerUuid,
    patientUuid
  );
};

/*
 – get authorized care providers for this patient
 – you want to also know if their flexpa links need to be refreshed.
 */
export const getPatientsForCareProvider = async (
  careProviderUuid: string
): Promise<Profile[]> => {
  const patients = await careProviderRepo.getPatientsByHealthcareProviderUid(
    careProviderUuid
  );

  return patients;
};

export const addAuthorizedHealthcareProviderForPatient = async (
  userUuid: string,
  careProviderUuid: string
): Promise<AuthorizedCareProviderLink> => {
  const authorizedCareProviderLink: AuthorizedCareProviderLink = {
    careProviderUuid,
    patientUuid: userUuid,
    uuid: v4(),
  };
  return await careProviderRepo.addAuthorizedHealthcareProviderLink(
    authorizedCareProviderLink
  );
};
