const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const { getUserProfile, addAuthorizedHealthcareProvider } = require("./repo");

module.exports.sendMedicationsToProvider = async (req, res) => {
  try {
    const tokenId = req.get("Authorization").split("Bearer ")[1];

    const decodedToken = await admin.auth().verifyIdToken(tokenId);
    const patientUid = decodedToken.uid;

    const { body } = req;
    const { healthcareProviderEmail, healthcareProviderName } = body;

    const profile = await getUserProfile(patientUid);

    // create a new authorized healthcare provider doc
    await addAuthorizedHealthcareProvider(
      patientUid,
      healthcareProviderEmail,
      healthcareProviderName
    );

    // // add the provider to the patient profile
    // await addProviderToPatientProfile(
    //   profile,
    //   healthcareProviderEmail,
    //   healthcareProviderName
    // );
    // now sent it as a link
    await sendProviderMedicationsInEmail(healthcareProviderEmail, profile);
    res.send({ data: "success" });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

const sendProviderMedicationsInEmail = async (
  healthcareProviderEmail,
  profile
) => {
  const { userUid, account } = profile;
  const { displayName } = account;

  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  const mailOptions = {
    from: ``,
    to: healthcareProviderEmail,
    subject: `${displayName} medical records authorization.`,
    html: `<p>${displayName} has authorized you to view their medical records. Click <a href="${process.env.BASE_URL}/medication-list-provider?patientUid=${userUid}">here</a> to see them.</p>`,
  };

  const res = await transporter.sendMail(mailOptions);
};

const addProviderToPatientProfile = async (
  profile,
  healthcareProviderEmail,
  healthcareProviderName
) => {
  let { healthcareProviders } = profile;

  if (!healthcareProviders) healthcareProviders = [];
  healthcareProviders = healthcareProviders.filter(
    (x) => x.healthcareProviderEmail !== healthcareProviderEmail
  );

  const newProvider = {
    healthcareProviderEmail,
    healthcareProviderName,
  };

  healthcareProviders = [...healthcareProviders, newProvider];
  const docRef = admin.firestore().collection("profiles").doc(profile.uid);
  await docRef.update({ healthcareProviders });
};

// https://firebase.google.com/docs/reference/js/v8/firebase.firestore.DocumentReference
