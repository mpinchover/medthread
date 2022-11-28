const { getDerivedMedications } = require("./repo");
const admin = require("firebase-admin");
// protect route https://github.com/firebase/functions-samples/blob/main/authorized-https-endpoint/functions/index.js
module.exports.getMedicationsByPatientUid = async (req, res) => {
  try {
    const tokenId = req.get("Authorization").split("Bearer ")[1];

    const decodedToken = await admin.auth().verifyIdToken(tokenId);
    const patientUid = decodedToken.uid;

    let medications = await getDerivedMedications(patientUid);
    medications = medications.sort(
      (a, b) => new Date(b.dateStarted) - new Date(a.dateStarted)
    );
    res.send({ medications });
  } catch (e) {
    console.log(e);
    res.status(501).send({ error: e });
  }
};
