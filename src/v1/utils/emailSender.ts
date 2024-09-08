import nodemailer from "nodemailer";

export const mailSender = async (
  email: string,
  title: string,
  body: string
): Promise<any> => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 465, // use SSL
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    const info = await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: title,
      html: body,
    });
    console.log("Mail sent successfully", info);
    return info;
  } catch (error: any) {
    console.error("Failed to send mail", error);
    throw error; // Bu yerda to'liq xatolik ob'ektini qaytarish yaxshiroq bo'ladi
  }
};
