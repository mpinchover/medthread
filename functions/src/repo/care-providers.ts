import * as admin from "firebase-admin";
import {
  AuthorizedCareProviderLink,
  AuthProfile,
  Profile,
} from "../types/types";
import { getUserProfile, getUserProfilesByUuids } from "./repo";
import { AUTHORIZED_CARE_PROVIDER_LINKS_COLLECTION } from "../config/constants";
import { stringSplitIntoBatches } from "../utils/utils";
import Database from "./mysql";

const authorizedCareProviderLinkTable = "authorizedCareProviderLink";

export const getAuthorizedHealthcareProviderForPatient = async (
  authUid: string,
  providerUuid: string,
  patientUuid: string
) => {
  const userProfile = await getUserProfile(providerUuid);

  if (userProfile.userRole !== "PROVIDER")
    throw new Error("must be a provider");
  // check verification
  const providerAuthProfile: AuthProfile = await admin.auth().getUser(authUid);

  if (!providerAuthProfile.emailVerified) {
    throw new Error("provider is not verified");
  }

  const existingHealthcareProvider = await getAuthorizedHealthcareProvider(
    providerUuid,
    patientUuid
  );

  console.log("EXISTING HEALTHCARE PROVIDER IS");
  console.log(existingHealthcareProvider);

  if (existingHealthcareProvider) return existingHealthcareProvider;
  return null;
};

// TODO – make sure that the care provider is authorized
// TODO – make sure that you get the insurance provider refresh state
export const getPatientsByHealthcareProviderUuid = async (
  providerUuid: string
): Promise<Profile[]> => {
  if (!providerUuid) {
    throw new Error("provider uid cannot be null");
  }

  // get all patient uids this provider is authorized for
  const patientUuids = await getPatientUuidsByHealthcareProviderUuid(
    providerUuid
  );
  if (patientUuids.length === 0) {
    return [];
  }

  console.log("PATIENT UUIDS");
  console.log(patientUuids);

  return await getUserProfilesByUuids(patientUuids);

  // split patient Uids into batches of 10
  const patientUuidBatches = stringSplitIntoBatches(patientUuids, 10);
  let patientProfiles: Profile[] = [];

  await Promise.allSettled(
    patientUuidBatches.map((batch) => {
      return getUserProfilesByUuids(batch);
    })
  ).then((results) => {
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        patientProfiles = [...patientProfiles, ...result.value];
      }
    });
  });

  return patientProfiles;

  // so you have patient profiles
  // now get all of their health insurance providers
  // check to see if the tokens are expired or not.
  // if they are, FE should be able to send a notification to the patient
  // to reauthenticate
  // on patient account page they should have the ability to reauth
};

//  get all the patient uids this provider is authorized for
// TODO - https://stackoverflow.com/questions/54583950/using-typescript-how-do-i-strongly-type-mysql-query-results
export const getPatientUuidsByHealthcareProviderUuid = async (
  providerUuid: string
): Promise<string[]> => {
  if (!providerUuid) {
    throw new Error("provider uuid cannot be null");
  }

  const conn = await Database.getDb();

  const query = `select * from ${authorizedCareProviderLinkTable} where careProviderUuid = ?`;
  const params: any[] = [providerUuid];

  const [rows] = await conn.query<any>(query, params);
  if (rows?.length === 0) return [];

  const patientUids: string[] = [];
  for (const record of rows) {
    const authCareProvider: AuthorizedCareProviderLink = record;
    if (authCareProvider?.patientUuid) {
      patientUids.push(authCareProvider?.patientUuid);
    }
  }

  return patientUids;
};

export const addAuthorizedHealthcareProviderLink = async (
  params: AuthorizedCareProviderLink
) => {
  // first check to see if the document exists
  const existingHealthcareProvider = await getAuthorizedHealthcareProvider(
    params.patientUuid,
    params.careProviderUuid
  );
  if (existingHealthcareProvider) return existingHealthcareProvider;

  const conn = await Database.getDb();
  const query = `insert into ${authorizedCareProviderLinkTable} set ? `;
  const p: any[] = [params];

  await conn.query(query, p);
  return params;
};

export const getAuthorizedHealthcareProvider = async (
  providerUuid: string,
  patientUuid: string
): Promise<AuthorizedCareProviderLink> => {
  const conn = await Database.getDb();
  const query = `select * from  ${authorizedCareProviderLinkTable} where careProviderUuid = ? and patientUuid = ?`;
  const params: any[] = [providerUuid, patientUuid];

  const [rows] = await conn.query<any>(query, params);
  if (rows?.length === 0) return null;

  const authCareProvider: AuthorizedCareProviderLink = rows[0];
  return authCareProvider;
};
