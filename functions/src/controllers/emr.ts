import * as nodemailer from "../gateway/nodemailer";

export const sendRequestForEMRDataForEOBEvent = async (
  eobUuid: string,
  providerUuid: string,
  patientUuid: string
) => {
  // for now just send the provider uid and the eobUid to the email
  const subject = "[Automated-EMR-request-for-event]";
  const emailTo = "info@usemedthread.com";
  const emailFrom = "automated@usemedthread.com";
  const content = `<p>
    <p>Provider UUID: ${providerUuid}</p>
    <p>Patient UUID: ${patientUuid}</p>
    <p>EOB UUID: ${eobUuid}</p>
  </p>`;
  await nodemailer.sendEmail(emailTo, emailFrom, subject, content);
};
