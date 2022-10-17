const admin = require("firebase-admin");

module.exports.getUserProfile = async (uid) => {
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

module.exports.getDerivedMedications = async (userUid) => {
  const medicationsRef = await admin.firestore().collection("medications");
  const snapshot = await medicationsRef.where("userUid", "==", userUid).get();
  if (snapshot.empty) return null;
  return snapshot.docs.map((e) => {
    const uid = e.id;
    return {
      ...e.data(),
      uid,
    };
  });
};
