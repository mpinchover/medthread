import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

import { getUserProfile, addAuthorizedHealthcareProvider } from "./repo/repo";

export const sendMedicationsToProvider = async (req: any, res: any) => {
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

    await sendProviderMedicationsInEmail(healthcareProviderEmail, profile);
    res.send({ data: "success" });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

const sendProviderMedicationsInEmail = async (
  healthcareProviderEmail: any,
  profile: any
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

// https://firebase.google.com/docs/reference/js/v8/firebase.firestore.DocumentReference
