import * as admin from "firebase-admin";
import {AuthorizedProvider} from "../types";

export const getAuthorizedHealthcareProvider = async (patientUid: string) => {
  const authorizedProvidersRef = await admin
      .firestore()
      .collection("authorized_providers");

  const snapshot = await authorizedProvidersRef
      .where("patientUid", "==", patientUid)
      .get();

  if (snapshot.empty) return [];

  return snapshot.docs.map((doc) => {
    const data: any = doc.data();

    const hcp: AuthorizedProvider = {
      ...data,
      uid: doc.id,
    };
    return hcp;
  });
};
