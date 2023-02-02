import * as admin from "firebase-admin";
import {
  AuthorizedCareProviderLink,
  Medication,
  Profile,
  AuthProfile,
} from "../types/types";
import Database from "./mysql";

const profilesTable = "profiles";

export const getUserProfile = async (uuid: string): Promise<Profile> => {
  try {
    const conn = await Database.getDb();

    console.log("SEARCHING UUID");
    console.log(uuid);
    const query = `select * from ${profilesTable} where uuid = ?`;
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

    const query = `select * from ${profilesTable} where uuid in (?)`;
    const params: any[] = [...uuids];
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

export const getAuthProfile = async (authUid: string) => {
  const authProfile: AuthProfile = await admin.auth().getUser(authUid);
  return authProfile;
};

export const hydrateUserProfile = async (
  userUuid: string
): Promise<Profile> => {
  if (!userUuid) return null;

  const conn = await Database.getDb();

  const query = `select * from ${profilesTable} where authUid = ?`;
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
