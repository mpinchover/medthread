const jwt_decode = require("jwt-decode");
const { getUserProfile, getDerivedMedications } = require("./repo");

// protect route https://github.com/firebase/functions-samples/blob/main/authorized-https-endpoint/functions/index.js
module.exports.getMedicationsByPatientUid = async (req, res) => {
  try {
    const { body } = req;
    const { patientUid } = body;

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
