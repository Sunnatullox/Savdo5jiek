import nodemailer from "nodemailer";

export const mailSender = async (email:string,title:string,body:string) => {
    // console.log("mailSender",email,title,body)
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });
    
        const info = await transporter.sendMail({
            from: process.env.SENDER_NAME,
            to: email,
            subject: title,
            html:body
        });

        return info;
    } catch (error) {
        console.log("mailSender error",error)
        return error;
    }
    
}