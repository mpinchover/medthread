import * as admin from "firebase-admin";
import { AuthorizedCareProviderLink, AuthProfile, Profile } from "../types";
import { getUserProfile, getUserProfilesByUids } from "./repo";
import { AUTHORIZED_CARE_PROVIDER_LINKS_COLLECTION } from "../config/constants";
import { stringSplitIntoBatches } from "../utils/utils";
// export const _getAuthorizedHealthcareProvider = async (patientUid: string) => {
//   const healthcareProvidersRef = await admin
//     .firestore()
//     .collection("authorized_providers");

//   const snapshot = await healthcareProvidersRef
//     .where("patientUid", "==", patientUid)
//     .get();

//   if (snapshot.empty) return [];

//   return snapshot.docs.map((doc) => {
//     const data: any = doc.data();

//     const hcp: AuthorizedProvider = {
//       ...data,
//       uid: doc.id,
//     };
//     return hcp;
//   });
// };

export const getAuthorizedHealthcareProviders = async (patientUid: string) => {
  const healthcareProvidersRef = await admin
    .firestore()
    .collection("healthcareProviders");

  const snapshot = await healthcareProvidersRef
    .where("patientUid", "==", patientUid)
    .get();

  if (snapshot.empty) return [];

  return snapshot.docs.map((doc) => {
    const data: any = doc.data();

    const hcp: AuthorizedCareProviderLink = {
      ...data,
      uid: doc.id,
    };
    return hcp;
  });
};

export const getAuthorizedHealthcareProviderForPatient = async (
  providerUid: string,
  patientUid: string
) => {
  const userProfile = await getUserProfile(providerUid);
  if (userProfile.role !== "PROVIDER") throw new Error("must be a provider");
  // check verification
  const providerAuthProfile: AuthProfile = await admin
    .auth()
    .getUser(providerUid);

  if (!providerAuthProfile.emailVerified) {
    throw new Error("provider is not verified");
  }

  const existingHealthcareProvider = await getAuthorizedHealthcareProvider(
    providerUid,
    patientUid
  );

  if (existingHealthcareProvider) return existingHealthcareProvider;
  return null;
};

// TODO – make sure that the care provider is authorized
// TODO – make sure that you get the insurance provider refresh state
export const getPatientsByHealthcareProviderUid = async (
  providerUid: string
): Promise<Profile[]> => {
  if (!providerUid) {
    throw new Error("provider uid cannot be null");
  }

  // get all patient uids this provider is authorized for
  const patientUids = await getPatientUidsByHealthcareProviderUid(providerUid);
  if (patientUids.length === 0) {
    return [];
  }

  // split patient Uids into batches of 10
  const patientUidBatches = stringSplitIntoBatches(patientUids, 10);
  let patientProfiles: Profile[] = [];

  await Promise.allSettled(
    patientUidBatches.map((batch) => {
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

  // so you have patient profiles
  // now get all of their health insurance providers
  // check to see if the tokens are expired or not.
  // if they are, FE should be able to send a notification to the patient
  // to reauthenticate
  // on patient account page they should have the ability to reauth
};

//  get all the patient uids this provider is authorized for
export const getPatientUidsByHealthcareProviderUid = async (
  providerUid: string
): Promise<string[]> => {
  if (!providerUid) {
    throw new Error("provider uid cannot be null");
  }
  const db = admin.firestore();

  const patientUids: string[] = [];

  const authorizedCareProvidersRef = db.collection(
    AUTHORIZED_CARE_PROVIDER_LINKS_COLLECTION
  );
  const query = authorizedCareProvidersRef.where(
    "careProviderUid",
    "==",
    providerUid
  );

  const snapshot = await query.get();
  if (snapshot.empty) return [];

  snapshot.docs.map((doc) => {
    const authCareProvider: AuthorizedCareProviderLink = doc.data();
    if (authCareProvider?.patientUid) {
      patientUids.push(authCareProvider?.patientUid);
    }
  });

  return patientUids;
};

export const addAuthorizedHealthcareProviderLink = async (
  patientUid: string,
  careProviderUid: string
) => {
  // first check to see if the document exists
  const existingHealthcareProvider = await getAuthorizedHealthcareProvider(
    patientUid,
    careProviderUid
  );
  if (existingHealthcareProvider) return existingHealthcareProvider;

  const authorizedProviderDoc = admin
    .firestore()
    .collection(AUTHORIZED_CARE_PROVIDER_LINKS_COLLECTION)
    .doc();

  const params: AuthorizedCareProviderLink = {
    patientUid,
    careProviderUid,
    uid: authorizedProviderDoc.id,
  };

  await authorizedProviderDoc.set(params);
  return params;
};

export const getAuthorizedHealthcareProvider = async (
  providerUid: string,
  patientUid: string
) => {
  const healthcareProvidersRef = await admin
    .firestore()
    .collection(AUTHORIZED_CARE_PROVIDER_LINKS_COLLECTION);

  const snapshot = await healthcareProvidersRef
    .where("careProviderUid", "==", providerUid)
    .where("patientUid", "==", patientUid)
    .get();

  if (snapshot.empty) return null;

  const doc: AuthorizedCareProviderLink = {
    ...snapshot.docs[0].data(),
    uid: snapshot.docs[0].id,
  };
  return doc;
};
