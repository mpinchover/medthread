import * as admin from "firebase-admin";
import { AuthorizedProvider, Medication, Profile, AuthProfile } from "../types";

export const getUserProfile = async (uid: string): Promise<Profile> => {
  try {
    const profiles = await admin.firestore().collection("profiles");

    const snapshot = await profiles.where("userUid", "==", uid).get();

    if (!snapshot || snapshot.empty) return null;

    const profile: Profile = snapshot.docs[0].data();

    const profileId = snapshot.docs[0].id;
    profile.uid = profileId;

    return profile;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getDerivedMedications = async (userUid: string) => {
  const medicationsRef = await admin.firestore().collection("medications");
  const snapshot = await medicationsRef.where("userUid", "==", userUid).get();
  if (snapshot.empty) return [];
  return snapshot.docs.map((e: any) => {
    const med: Medication = e.data();
    med.uid = e.id;
    med.source = "PATIENT";
    return med;
  });
};

export const getAuthProfile = async (uid: string) => {
  const authProfile: AuthProfile = await admin.auth().getUser(uid);
  return authProfile;
};

export const addAuthorizedHealthcareProvider = async (
  patientUid: string,
  providerEmail: string
) => {
  // first check to see if the document exists
  const existingHealthcareProvider = await getAuthorizedHealthcareProvider(
    patientUid,
    providerEmail
  );
  if (existingHealthcareProvider) return existingHealthcareProvider;

  const authorizedProviderDoc = admin
    .firestore()
    .collection("authorizedProviders")
    .doc();

  const params: AuthorizedProvider = {
    healthcareProviderEmail: providerEmail,
    patientUid,
    uid: authorizedProviderDoc.id,
  };

  await authorizedProviderDoc.set(params);
  return params;
};
export const hydrateUserProfile = async (userUid: string): Promise<Profile> => {
  if (!userUid) return null;

  const db = admin.firestore();
  const profilesRef = db.collection("profiles");
  const snapshot = await profilesRef.where("userUid", "==", userUid).get();

  if (snapshot.empty) return null;
  return snapshot.docs[0].data();
};

export const createHydratedUserProfile = async (
  params: Profile
): Promise<Profile> => {
  const db = admin.firestore();

  const profilesDocRef = db.collection("profiles").doc();
  params.uid = profilesDocRef.id;
  await profilesDocRef.set(params);
  return params;
};

export const getAuthorizedHealthcareProvider = async (
  patientUid: string,
  providerEmail: string
) => {
  const authorizedProvidersRef = await admin
    .firestore()
    .collection("authorizedProviders");

  const snapshot = await authorizedProvidersRef
    .where("healthcareProviderEmail", "==", providerEmail)
    .where("patientUid", "==", patientUid)
    .get();

  if (snapshot.empty) return null;

  const doc: AuthorizedProvider = {
    ...snapshot.docs[0].data(),
    uid: snapshot.docs[0].id,
  };
  return doc;
};

export const getPatientsByProviderUid = async (providerUid: string) => {
  // first get the provider auth profile to get the email

  const providerAuthProfile: AuthProfile = await admin
    .auth()
    .getUser(providerUid);
  // if (!providerAuthProfile.emailVerified) throw new Error("provider is not verified")
  const providerEmail = providerAuthProfile.email;
  // now query all the authorized healthcare docs that this provider has been authorized for
  const authorizedProvidersRef = await admin
    .firestore()
    .collection("authorizedProviders");

  let snapshot = await authorizedProvidersRef
    .where("healthcareProviderEmail", "==", providerEmail)
    .get();
  const patientUids: string[] = snapshot.docs.map(
    (doc: any) => doc.data().patientUid
  );

  if (patientUids.length == 0) {
    return [];
  }
  // now get patient names
  const profilesRef = await admin.firestore().collection("profiles");
  snapshot = await profilesRef.where("userUid", "in", patientUids).get();
  if (snapshot.empty) return null;

  // TODO sort by the time it was added
  const patients: Profile[] = snapshot.docs.map((doc: any) => {
    return doc.data();
  });
  return patients;
};

export const getPatientsForProvider = async (providerUid: string) => {
  try {
    const authProfile: AuthProfile = await getAuthProfile(providerUid);
    const { email } = authProfile;
    if (!email) {
      throw new Error("email is required for getting previous patients");
    }

    const profiles = await admin.firestore().collection("profiles");

    const snapshot = await profiles.where("userUid", "==", providerUid).get();

    if (!snapshot || snapshot.empty) return null;

    const profile: Profile = snapshot.docs[0].data();

    const profileId = snapshot.docs[0].id;
    profile.uid = profileId;

    return profile;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

// https://firebase.google.com/docs/firestore/manage-data/add-data
