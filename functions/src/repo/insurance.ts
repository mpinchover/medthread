import * as admin from "firebase-admin";
import { InsuranceProvider } from "../types";

export const addInsuranceProviderForPatient = async (
  params: InsuranceProvider
) => {
  try {
    const db = admin.firestore();
    const insuranceProviderDocRef = db.collection("insuranceProviders").doc();
    params.uid = insuranceProviderDocRef.id;
    await insuranceProviderDocRef.set(params);
  } catch (e) {
    console.log(e);
  }
  return params;
};

export const updateAccessTokenForInsuranceProvider = async (
  uid: string,
  accessToken: string
) => {
  const db = admin.firestore();
  const docRef = db.collection("insuranceProviders").doc(uid);
  await docRef.update({ accessToken });
};

export const getInsuranceProviderByUserUidAndName = async (
  providerName: string,
  userUid: string
): Promise<null | InsuranceProvider> => {
  const db = admin.firestore();
  const insuranceProvidersRef = db.collection("insuranceProviders");
  const snapshot = await insuranceProvidersRef
    .where("providerName", "==", providerName)
    .where("userUid", "==", userUid)
    .get();

  if (snapshot.empty) return null;

  const data: any = snapshot.docs[0].data();
  const uid = snapshot.docs[0].id;

  const res: InsuranceProvider = {
    ...data,
    uid,
  };
  return res;
};

export const getHealthInsuranceProvidersByPatientUid = async (
  userUid: string
): Promise<InsuranceProvider[]> => {
  const db = admin.firestore();
  const insuranceProvidersRef = db.collection("insuranceProviders");
  const snapshot = await insuranceProvidersRef
    .where("userUid", "==", userUid)
    .get();

  if (snapshot.empty) return [];

  const res: InsuranceProvider[] = snapshot.docs.map((doc) => {
    const data: any = doc.data();
    return {
      ...data,
      uid: doc.id,
    };
  });

  return res;
};
