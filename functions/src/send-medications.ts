import * as nodemailer from "nodemailer";
import * as medicationsRepo from "./repo/medications";

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
    await addAuthorizedHealthcareProvider(userUid, healthcareProviderEmail);
    const meds = await medicationsRepo.getMedicationsByUserUid(userUid);
    await sendProviderMedicationsInEmail(
      healthcareProviderEmail,
      profile,
      meds
    );
    res.send({ data: "success" });
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

  console.log("MEDS ARE");
  console.log(meds);
  // const meds = [
  //   {
  //     medicationName: "ADVIL",
  //     dateStarted: "Jan 1st, 20202",
  //     source: "CLAIMS",
  //   },
  //   {
  //     medicationName: "ADVIL",
  //     dateStarted: "Jan 30st, 20202",
  //     source: "PATIENT",
  //   },
  // ];

  const mailBody = `
    <div>
    ${meds.map((e) => {
      return `<div style="">
        <div>${displayName} medication list</div>
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
    })}

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
