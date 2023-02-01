import * as admin from "firebase-admin";
import {
  AuthorizedCareProviderLink,
  Medication,
  Profile,
  AuthProfile,
} from "../types";
import Database from "./mysql";

const profilesTable = "profiles";

export const getUserProfile = async (uuid: string): Promise<Profile> => {
  try {
    const conn = await Database.getDb();

    const query = `select * from ${profilesTable} where userUuid = ?`;
    const params: any[] = [uuid];
    const [rows] = await conn.query<any>(query, params);
    if (rows?.length === 0) return null;
    return rows[0];
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getUserProfilesByUuids = async (
  uuids: string[]
): Promise<Profile[]> => {
  try {
    const profiles: Profile[] = [];
    if (uuids.length === 0) return profiles;

    const conn = await Database.getDb();

    const query = `select * from ${profilesTable} where userUuid in (?)`;
    const params: any[] = [uuids];
    const [rows] = await conn.query<any>(query, params);
    for (const record of rows) {
      profiles.push(record);
    }
    return profiles;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

// export const getDerivedMedications = async (userUid: string) => {
//   const medicationsRef = await admin.firestore().collection("medications");
//   const snapshot = await medicationsRef.where("userUid", "==", userUid).get();
//   if (snapshot.empty) return [];
//   return snapshot.docs.map((e: any) => {
//     const med: Medication = e.data();
//     med.uid = e.id;
//     med.source = "PATIENT";
//     return med;
//   });
// };

export const getAuthProfile = async (uid: string) => {
  const authProfile: AuthProfile = await admin.auth().getUser(uid);
  return authProfile;
};

export const hydrateUserProfile = async (
  userUuid: string
): Promise<Profile> => {
  if (!userUuid) return null;

  const conn = await Database.getDb();

  const query = `select * from ${profilesTable} where userUuid = ?`;
  const params: any[] = [userUuid];
  const [rows] = await conn.query<any>(query, params);
  if (rows.length === 0) return null;
  return rows[0];
};

export const createHydratedUserProfile = async (
  profile: Profile
): Promise<Profile> => {
  const conn = await Database.getDb();

  const query = `insert into ${profilesTable} set ?`;
  const params: any[] = [profile];
  await conn.query<any>(query, params);
  return profile;
};

// export const getPatientsByProviderUid = async (providerUid: string) => {
//   // // first get the provider auth profile to get the email

//   // const providerAuthProfile: AuthProfile = await admin
//   //   .auth()
//   //   .getUser(providerUid);
//   // // if (!providerAuthProfile.emailVerified) throw new Error("provider is not verified")
//   // const providerEmail = providerAuthProfile.email;
//   // // now query all the authorized healthcare docs that this provider has been authorized for
//   // const healthcareProvidersRef = await admin
//   //   .firestore()
//   //   .collection("healthcareProviders");

//   const db = admin.firestore();
//   const healthcareProvidersRef = db.collection("healthcareProviders");

//   let snapshot = await healthcareProvidersRef
//     .where("providerUid", "==", providerEmail)
//     .get();
//   const patientUids: string[] = snapshot.docs.map(
//     (doc: any) => doc.data().patientUid
//   );

//   if (patientUids.length == 0) {
//     return [];
//   }
//   // now get patient names
//   const profilesRef = await admin.firestore().collection("profiles");
//   snapshot = await profilesRef.where("userUid", "in", patientUids).get();
//   if (snapshot.empty) return null;

//   // TODO sort by the time it was added
//   const patients: Profile[] = snapshot.docs.map((doc: any) => {
//     return doc.data();
//   });
//   return patients;
// };

// export const getPatientsForProvider = async (providerUid: string) => {
//   try {
//     const authProfile: AuthProfile = await getAuthProfile(providerUid);
//     const { email } = authProfile;
//     if (!email) {
//       throw new Error("email is required for getting previous patients");
//     }

//     const profiles = await admin.firestore().collection("profiles");

//     const snapshot = await profiles.where("userUid", "==", providerUid).get();

//     if (!snapshot || snapshot.empty) return null;

//     const profile: Profile = snapshot.docs[0].data();

//     const profileId = snapshot.docs[0].id;
//     profile.uid = profileId;

//     return profile;
//   } catch (e) {
//     console.log(e);
//     throw e;
//   }
// };

// https://firebase.google.com/docs/firestore/manage-data/add-data
