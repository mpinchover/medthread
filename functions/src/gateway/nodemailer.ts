import * as nodemailer from "nodemailer";

export const sendEmail = async (
  emailTo: string,
  emailFrom: string,
  subject: string,
  content: string
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  const mailOptions = {
    from: emailFrom,
    to: emailTo,
    subject: subject,
    html: content,
  };

  await transporter.sendMail(mailOptions);
};
