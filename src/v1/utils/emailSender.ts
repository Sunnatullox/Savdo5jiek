import nodemailer from "nodemailer";

export const mailSender = async (email:string,title:string,body:string):Promise<any> => {
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
    return info
    } catch (error:any) {
      throw new Error(error.message)
    }
    
}