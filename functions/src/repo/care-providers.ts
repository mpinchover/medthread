import * as admin from "firebase-admin";
import { AuthorizedCareProviderLink, AuthProfile, Profile } from "../types";
import { getUserProfile, getUserProfilesByUids } from "./repo";
import { AUTHORIZED_CARE_PROVIDER_LINKS_COLLECTION } from "../config/constants";
import { stringSplitIntoBatches } from "../utils/utils";
import Database from "./database";
import * as constants from "../config/constants";

export const getAuthorizedHealthcareProviders = async (patientUid: string) => {
  const db = await Database.getDb();

  const authorizedProviders: AuthorizedCareProviderLink[] = [];
  const c = db.collection(constants.HEALTHCARE_PROVIDER_COLLECTION);
  const docs = await c.find({ patientUid });
  await docs.forEach((doc: any) => {
    const document: AuthorizedCareProviderLink = doc;
    authorizedProviders.push(document);
  });

  console.log("PROVIDERS ARE");
  console.log(authorizedProviders);

  return authorizedProviders;
};

export const getAuthorizedHealthcareProviderForPatient = async (
  authUid: string,
  providerUuid: string,
  patientUuid: string
) => {
  // console.log("GETTING THE PROFILE");
  const userProfile = await getUserProfile(providerUuid);
  // console.log("CARE PROFILE");
  // console.log(userProfile);
  if (userProfile.role !== "PROVIDER") {
    // console.log("ERROR POINT 1");
    throw new Error("must be a provider");
  }
  // check verification
  const providerAuthProfile: AuthProfile = await admin.auth().getUser(authUid);

  if (!providerAuthProfile.emailVerified) {
    // console.log("ERROR POINT 2");
    throw new Error("provider is not verified");
  }

  const existingHealthcareProvider = await getAuthorizedHealthcareProvider(
    providerUuid,
    patientUuid
  );

  if (existingHealthcareProvider) return existingHealthcareProvider;
  return null;
};

// TODO – make sure that the care provider is authorized
// TODO – make sure that you get the insurance provider refresh state
export const getPatientsByHealthcareProviderUid = async (
  providerUuid: string
): Promise<Profile[]> => {
  if (!providerUuid) {
    throw new Error("provider uid cannot be null");
  }

  // get all patient uids this provider is authorized for
  const patientUuids = await getPatientUidsByHealthcareProviderUid(
    providerUuid
  );
  if (patientUuids.length === 0) {
    return [];
  }

  // split patient Uids into batches of 10
  const patientUuidBatches = stringSplitIntoBatches(patientUuids, 10);
  let patientProfiles: Profile[] = [];

  await Promise.allSettled(
    patientUuidBatches.map((batch) => {
      return getUserProfilesByUids(batch);
    })
  ).then((results) => {
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        patientProfiles = [...patientProfiles, ...result.value];
      }
    });
  });
  return patientProfiles;
};

//  get all the patient uids this provider is authorized for
export const getPatientUidsByHealthcareProviderUid = async (
  providerUuid: string
): Promise<string[]> => {
  if (!providerUuid) {
    throw new Error("provider uid cannot be null");
  }

  const db = await Database.getDb();
  // const db = admin.firestore();

  const patientUids: string[] = [];

  const c = db.collection(constants.AUTHORIZED_CARE_PROVIDER_LINKS_COLLECTION);
  const docs = await c.find({ careProviderUuid: providerUuid });
  await docs.forEach((doc: any) => {
    const authCareProvider: AuthorizedCareProviderLink = doc;
    if (authCareProvider?.patientUuid) {
      patientUids.push(authCareProvider?.patientUuid);
    }
  });

  return patientUids;
};

export const addAuthorizedHealthcareProviderLink = async (
  params: AuthorizedCareProviderLink
): Promise<AuthorizedCareProviderLink> => {
  // first check to see if the document exists
  const existingHealthcareProvider = await getAuthorizedHealthcareProvider(
    params?.patientUuid,
    params?.careProviderUuid
  );
  if (existingHealthcareProvider)
    return existingHealthcareProvider as AuthorizedCareProviderLink;

  const db = await Database.getDb();
  const c = db.collection(constants.AUTHORIZED_CARE_PROVIDER_LINKS_COLLECTION);

  const res = await c.insertOne(params);
  return params as AuthorizedCareProviderLink;
};

export const getAuthorizedHealthcareProvider = async (
  providerUuid: string,
  patientUuid: string
) => {
  const db = await Database.getDb();
  const c = db.collection(constants.AUTHORIZED_CARE_PROVIDER_LINKS_COLLECTION);
  const doc = await c.findOne({ careProviderUuid: providerUuid, patientUuid });
  return doc;
};
