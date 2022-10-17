const admin = require("firebase-admin");
const jwt_decode = require("jwt-decode");
const { getUserProfile, getDerivedMedications } = require("./repo");

module.exports.getPatientMedicationsForProvider = async (req, res) => {
  const { body } = req;
  const { patientUid } = body;

  try {
    const tokenId = req.get("Authorization").split("Bearer ")[1];
    const decoded = await jwt_decode(tokenId);
    const { user_id } = decoded;

    const userUid = user_id;

    const providerProfile = await getUserProfile(userUid);
    if (providerProfile.role !== "PROVIDER")
      throw new Error("only providers can access patient medical records");

    const authProfile = await admin.auth().getUser(userUid);
    if (!authProfile.emailVerified)
      throw new Error("provider must be verified");

    // check to see if the patient has added this provider as an authenticated provider.
    const patientProfile = await getUserProfile(patientUid);
    if (!patientProfile) throw new Error("patient profile cannot be null");
    const { healthcareProviders } = patientProfile;

    if (!healthcareProviders)
      throw new Error("no healthcare providers given for patient");

    const isAuthenticatedProvider = healthcareProviders.filter(
      (x) => x.healthcareProviderEmail === authProfile.email
    );

    if (!isAuthenticatedProvider)
      throw new Error("provider is not authenticated");

    let medications = await getDerivedMedications(patientUid);
    medications = medications.sort(
      (a, b) => new Date(b.dateStarted) - new Date(a.dateStarted)
    );
    res.send({ medications });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e });
  }
};

// https://firebase.google.com/docs/auth/admin/manage-users
// token verification https://firebase.google.com/docs/auth/admin/verify-id-tokens
