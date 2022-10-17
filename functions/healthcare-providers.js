const jwt_decode = require("jwt-decode");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

const { getUserProfile } = require("./repo");

const addAuthorizedHealthcareProvider = async (req, res) => {
  try {
    const tokenId = req.get("Authorization").split("Bearer ")[1];
    const decoded = await jwt_decode(tokenId);
    const { user_id } = decoded;

    if (!user_id) throw new Error("unauthorized access");
    const { body } = req;
    const { healthcareProviderEmail, healthcareProviderName } = body;
    const patientProfile = await getUserProfile(user_id);

    let doc;

    if (!patientProfile) {
      // create a new patient profile
      const docRef = await admin
        .firestore()
        .collection("profiles")
        .add({
          userUid: user_id,
          healthcareProviders: {
            [healthcareProviderEmail]: {
              healthcareProviderEmail,
              healthcareProviderName,
            },
          },
        });

      const docData = await docRef.get();
      doc = await docData.data();
    } else {
      // update profile
      const profile = patientProfile;
      const existingRef = admin
        .firestore()
        .collection("profiles")
        .doc(profile.uid);

      doc = {
        ...profile,
        healthcareProviders: {
          ...profile.healthcareProviders,
          [healthcareProviderEmail]: {
            healthcareProviderEmail,
            healthcareProviderName,
          },
        },
      };
      await existingRef.update({
        ...doc,
      });
    }
    await sendEmailToProvider();
    res.send({ patient_profile: doc });
  } catch (e) {
    console.log("ERROR IS");
    console.log(e);
    res.status(501).send({ error: e });
  }
};

const sendEmailToProvider = async () => {
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
    to: "",
    subject: "Matt Pennywheel medical records authorization.",
    html: `<p>Matt Pennywheel has authorized you to view their medical records. Click <a href="http://localhost:3000/medication-list">here</a> to see them.</p>`,
  };

  const res = await transporter.sendMail(mailOptions);
};

module.exports = {
  addAuthorizedHealthcareProvider,
};
