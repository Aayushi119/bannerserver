// middlewares/nodemailer.middleware.ts

import nodemailer from "nodemailer";

interface EmailOptions {
  subject: string;
  text: string;
}

export const sendEmail = async ({ subject, text }: EmailOptions): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // ya jo bhi service use karni ho
      auth: {
        user: process.env.EMAIL_USER, // .env me apna email daalna
        pass: process.env.EMAIL_PASS, // .env me apna email password ya app password daalna
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL, // yahan wo email jahan tujhe mails chahiye
      subject,
      text,
    });

  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
