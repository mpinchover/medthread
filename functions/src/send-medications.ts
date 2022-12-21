import * as nodemailer from "nodemailer";
import * as medicationsRepo from "./repo/medications";
import { v4 } from "uuid";
import { getUserProfile, addAuthorizedHealthcareProvider } from "./repo/repo";
import { Medication } from "./types";

export const sendMedicationsToProvider = async (req: any, res: any) => {
  try {
    // const tokenId = req.get("Authorization").split("Bearer ")[1];

    // const decodedToken = await admin.auth().verifyIdToken(tokenId);
    // const patientUid = decodedToken.uid;

    const { body, user } = req;
    const userUid = user.user_id;
    const { healthcareProviderEmail } = body;

    const profile = await getUserProfile(userUid);

    // // create a new authorized healthcare provider doc
    const healthcareProvider = await addAuthorizedHealthcareProvider(
      userUid,
      healthcareProviderEmail
    );
    const meds = await medicationsRepo.getMedicationsByUserUid(userUid);

    await sendProviderMedicationsInEmail(
      healthcareProviderEmail,
      profile,
      meds
    );
    res.send({ healthcareProvider });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

const sendProviderMedicationsInEmail = async (
  healthcareProviderEmail: any,
  profile: any,
  meds: Medication[]
) => {
  const { account } = profile;
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

  const seq = v4();

  const mailBody = `
    <div>
    <div>Medications for ${displayName} (${seq})</div>
    <br />
    ${meds
      .map((e) => {
        return `<div style="">
        <div>
          <span style="width:400px">Medication: </span>
          <span>${e.medicationName}</span>
        </div>
        <div>
          <span>Date started: </span>
          <span>${e.dateStarted}</span>
        </div>
        <div>
          <span>Source: </span>
          <span>${e.source}</span>
        </div>
        <br />
      </div>`;
      })
      .join("")}

    </div>
  `;

  const mailOptions = {
    from: ``,
    to: healthcareProviderEmail,
    subject: `${displayName} medical records`,
    html: mailBody,
  };

  await transporter.sendMail(mailOptions);
};

// https://firebase.google.com/docs/reference/js/v8/firebase.firestore.DocumentReference
