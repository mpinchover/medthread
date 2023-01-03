import * as admin from "firebase-admin";
import { AuthorizedProvider, AuthProfile } from "../types";
import { getUserProfile, getAuthorizedHealthcareProvider } from "./repo";
// export const _getAuthorizedHealthcareProvider = async (patientUid: string) => {
//   const authorizedProvidersRef = await admin
//     .firestore()
//     .collection("authorized_providers");

//   const snapshot = await authorizedProvidersRef
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
  const authorizedProvidersRef = await admin
    .firestore()
    .collection("authorizedProviders");

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
    patientUid,
    providerAuthProfile.email
  );

  if (existingHealthcareProvider) return existingHealthcareProvider;
  return null;
};
