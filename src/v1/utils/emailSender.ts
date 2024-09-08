import nodemailer from "nodemailer";

export const mailSender = async (emails:string,title:string,body:string) => {
    const emailItems = emails?.split(",")
    try {
        if (emailItems.length > 1) {
            for (let index = 0; index < emailItems.length; index++) {
                const email = emailItems[index];
                const transporter = nodemailer.createTransport({
                    host: process.env.MAIL_HOST,
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.MAIL_USER,
                        pass: process.env.MAIL_PASS
                    }
                });
            
             const info =    await transporter.sendMail({
                    from: process.env.SENDER_NAME,
                    to: email,
                    subject: title,
                    html:body
                });
             return info
            }
        }else{
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
                to: emails,
                subject: title,
                html:body
            });
            return info
        }
    } catch (error:any) {
      throw new Error(error.message)
    }
    
}