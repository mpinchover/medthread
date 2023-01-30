import * as admin from "firebase-admin";
import {
  AuthorizedCareProviderLink,
  Medication,
  Profile,
  AuthProfile,
} from "../types";
import Database from "./database";
import * as constants from "../config/constants";
export const getUserProfile = async (uuid: string): Promise<Profile> => {
  try {
    const db = await Database.getDb();

    // const profiles = await admin.firestore().collection("profiles");
    const profiles = db.collection(constants.PROFILE_COLLECTION);
    const profile: any = await profiles.findOne({ userUuid: uuid });
    if (!profile) {
      return null;
    }
    return profile;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const testFn = async () => {
  const db = await Database.getDb();

  await db.collection("drinks").insertOne({ value: 30 });
  const doc = await db.collection("drinks").findOne({ value: 30 });
  console.log(doc);
};

export const getUserProfilesByUids = async (
  uuids: string[]
): Promise<Profile[]> => {
  try {
    const db = await Database.getDb();
    if (uuids?.length === 0) return [];

    const profiles: Profile[] = [];
    const profilesRef = db.collection(constants.PROFILE_COLLECTION);
    const documents = await profilesRef.find({ userUuid: { $in: uuids } });
    await documents.forEach((doc: any) => {
      profiles.push(doc);
    });

    console.log("PROFILES ARE");
    console.log(profiles);
    return profiles;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

// // TODO – deprecate
// export const getDerivedMedications = async (userUuid: string) => {
//   const medicationsRef = await admin.firestore().collection("medications");
//   const snapshot = await medicationsRef.where("userUid", "==", userUuid).get();
//   if (snapshot.empty) return [];
//   return snapshot.docs.map((e: any) => {
//     const med: Medication = e.data();
//     med.uuid = e.id;
//     med.source = "PATIENT";
//     return med;
//   });
// };

export const getAuthProfile = async (uid: string) => {
  const authProfile: AuthProfile = await admin.auth().getUser(uid);
  return authProfile;
};

export const hydrateUserProfile = async (authUid: string): Promise<Profile> => {
  const db = await Database.getDb();
  if (!authUid) return null;

  const profilesRef = db.collection(constants.PROFILE_COLLECTION);
  const profile: any = await profilesRef.findOne({ authUid });
  // const snapshot = await profilesRef.where("userUid", "==", userUid).get();
  return profile;
};

export const createHydratedUserProfile = async (
  params: Profile
): Promise<Profile> => {
  const db = await Database.getDb();
  const profilesRef = db.collection(constants.PROFILE_COLLECTION);
  await profilesRef.insertOne(params);
  return params as Profile;
};
