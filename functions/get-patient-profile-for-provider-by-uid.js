const {
  getUserProfile,
  getAuthProfile,
  getAuthorizedHealthcareProvider,
} = require("./repo");
const admin = require("firebase-admin");
const { provider } = require("firebase-functions/v1/analytics");

module.exports.getPatientProfileForProviderByUid = async (req, res) => {
  try {
    const tokenId = req.get("Authorization").split("Bearer ")[1];

    const decodedToken = await admin.auth().verifyIdToken(tokenId);
    const providerUid = decodedToken.uid;

    const { body } = req;
    const { patientUid } = body;

    const authProfile = await getAuthProfile(providerUid);
    if (!authProfile.emailVerified)
      throw new Error("Provider must be verified");

    const providerEmail = authProfile.email;

    const existingHealthcareProvider = await getAuthorizedHealthcareProvider(
      patientUid,
      providerEmail
    );
    
    if (!existingHealthcareProvider)
      throw new Error("Provider must be authorized to vew patient records");

    const patientProfile = await getUserProfile(patientUid);
    res.send({ patient: patientProfile });
  } catch (e) {
    console.log(e);
    res.status(500).send({ e: error });
  }
};
