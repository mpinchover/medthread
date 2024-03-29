import * as careProviderRepo from "../repo/care-providers";
import { AuthorizedCareProviderLink, Profile } from "../types/types";
import * as uuid from "uuid";

export const getAuthorizedHealthcareProviderForPatientRecords = async (
  authUid: string,
  providerUuid: string,
  patientUuid: string
) => {
  console.log(patientUuid);
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
  const patients = await careProviderRepo.getPatientsByHealthcareProviderUuid(
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
    uuid: uuid.v4(),
  };
  return await careProviderRepo.addAuthorizedHealthcareProviderLink(
    authorizedCareProviderLink
  );
};
