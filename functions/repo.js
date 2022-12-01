const admin = require("firebase-admin");

const getUserProfile = async (uid) => {
  try {
    const profiles = await admin.firestore().collection("profiles");

    const snapshot = await profiles.where("userUid", "==", uid).get();

    if (!snapshot || snapshot.empty) return null;

    const profile = snapshot.docs[0].data();

    const profileId = snapshot.docs[0].id;
    profile.uid = profileId;

    return profile;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
module.exports.getUserProfile = getUserProfile;

const getDerivedMedications = async (userUid) => {
  const medicationsRef = await admin.firestore().collection("medications");
  const snapshot = await medicationsRef.where("userUid", "==", userUid).get();
  if (snapshot.empty) return [];
  return snapshot.docs.map((e) => {
    const uid = e.id;
    return {
      ...e.data(),
      uid,
    };
  });
};
module.exports.getDerivedMedications = getDerivedMedications;

const getAuthProfile = async (uid) => {
  const authProfile = await admin.auth().getUser(uid);
  return authProfile;
};
module.exports.getAuthProfile = getAuthProfile;

const addAuthorizedHealthcareProvider = async (
  patientUid,
  providerEmail,
  providerName
) => {
  // first check to see if the document exists
  const existingHealthcareProvider = await getAuthorizedHealthcareProvider(
    patientUid,
    providerEmail
  );
  if (existingHealthcareProvider) return;

  const authorizedProvidersRef = admin
    .firestore()
    .collection("authorized_providers");

  const authorizedProviderDoc = {
    healthcareProviderEmail: providerEmail,
    patientUid,
  };

  if (providerName) authorizedProviderDoc.providerName = providerName;

  const res = await authorizedProvidersRef.add(authorizedProviderDoc);
  return {
    healthcareProviderEmail: providerEmail,
    patientUid,
    docUid: res.id,
  };
};
module.exports.addAuthorizedHealthcareProvider =
  addAuthorizedHealthcareProvider;

const getAuthorizedHealthcareProvider = async (patientUid, providerEmail) => {
  const authorizedProvidersRef = await admin
    .firestore()
    .collection("authorized_providers");

  const snapshot = await authorizedProvidersRef
    .where("healthcareProviderEmail", "==", providerEmail)
    .where("patientUid", "==", patientUid)
    .get();

  if (snapshot.empty) return null;
  const doc = {
    ...snapshot.docs[0].data(),
    docUid: snapshot.docs[0].id,
  };
  return doc;
};

module.exports.getAuthorizedHealthcareProvider =
  getAuthorizedHealthcareProvider;

const getPatientsByProviderUid = async (providerUid) => {
  // first get the provider auth profile to get the email

  const providerAuthProfile = await admin.auth().getUser(providerUid);
  // if (!providerAuthProfile.emailVerified) throw new Error("provider is not verified")
  const providerEmail = providerAuthProfile.email;
  // now query all the authorized healthcare docs that this provider has been authorized for
  const authorizedProvidersRef = await admin
    .firestore()
    .collection("authorized_providers");

  let snapshot = await authorizedProvidersRef
    .where("healthcareProviderEmail", "==", providerEmail)
    .get();
  const patientUids = snapshot.docs.map((doc) => doc.data().patientUid);

  if (patientUids.length == 0) {
    return [];
  }
  // now get patient names
  const profilesRef = await admin.firestore().collection("profiles");
  snapshot = await profilesRef.where("userUid", "in", patientUids).get();
  if (snapshot.empty) return null;

  // TODO sort by the time it was added
  const patients = snapshot.docs.map((doc) => {
    return doc.data();
  });
  return patients;
};
module.exports.getPatientsByProviderUid = getPatientsByProviderUid;

const getPatientsForProvider = async (providerUid) => {
  try {
    const authProfile = await getAuthProfile(providerUid);
    const { email } = authProfile;
    if (!email)
      throw new Error("email is required for getting previous patients");

    const profiles = await admin.firestore().collection("profiles");

    const snapshot = await profiles.where("userUid", "==", uid).get();

    if (!snapshot || snapshot.empty) return null;

    const profile = snapshot.docs[0].data();

    const profileId = snapshot.docs[0].id;
    profile.uid = profileId;

    return profile;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
module.exports.getPatientsForProvider = getPatientsForProvider;

// https://firebase.google.com/docs/firestore/manage-data/add-data
