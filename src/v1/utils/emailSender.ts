import nodemailer from "nodemailer";

export const mailSender = async (email: string, title: string, body: string): Promise<any> => {
    try {
        console.log("Setting up transporter with", process.env.MAIL_HOST);
        console.log(email,title,body)
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        console.log("Sending mail to", email);
        const info = await transporter.sendMail({
            from: process.env.SENDER_NAME,
            to: email,
            subject: title,
            html: body
        });
        console.log("Mail sent successfully", info);
        return info;
    } catch (error: any) {
        console.error("Failed to send mail", error);
        throw error; // Bu yerda to'liq xatolik ob'ektini qaytarish yaxshiroq bo'ladi
    }
}