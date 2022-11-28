const { getPatientsByProviderUid } = require("./repo");
const admin = require("firebase-admin");

module.exports.getPreviousPatients = async (req, res) => {
  try {
    const tokenId = req.get("Authorization").split("Bearer ")[1];

    const decodedToken = await admin.auth().verifyIdToken(tokenId);
    const providerUid = decodedToken.uid;

    // get the provider uid out of the header
    const previousPatients = await getPatientsByProviderUid(providerUid);
    res.send({ previousPatients });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e });
  }
};

module.exports.hello = async (requ, res) => {
  try {
    res.send({ data: "HELLO FROM APP" });
  } catch (e) {
    res.status(500).send({ error: e });
  }
};
