import * as nodemailer from "../gateway/nodemailer";

export const sendRequestForEMRDataForEOBEvent = async (
  eobUID: string,
  providerUid: string,
  patientUid: string
) => {
  // for now just send the provider uid and the eobUid to the email
  console.log("SENDING EMAIL OUT");
  const subject = "[Automated-EMR-request-for-event]";
  const emailTo = "info@usemedthread.com";
  const emailFrom = "automated@usemedthread.com";
  const content = `<p>
    <p>Provider UID: ${providerUid}</p>
    <p>Patient UID: ${patientUid}</p>
    <p>EOB UID: ${eobUID}</p>
  </p>`;
  await nodemailer.sendEmail(emailTo, emailFrom, subject, content);
};