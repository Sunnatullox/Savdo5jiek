export const mailSender = async (
    email: string,
    title: string,
    body: string
): Promise<any> => {
    try {
        const { SMTPClient } = await import('emailjs');
        const client = new SMTPClient({
            user: process.env.MAIL_USER, // Sizning Gmail manzilingiz
            password: process.env.MAIL_PASS,      // Yaratilgan app parol
            host: process.env.MAIL_HOST,          // Gmail SMTP server
            ssl: true                        // SSL orqali ulanish
          });
      const message = await client.sendAsync({
        from: process.env.MAIL_USER as string, // Kimdan
        to: email, // Kimga
        subject: title,          // Xat mavzusi
        text: body,
        html: body,
        attachment: [{
            data: body,
            alternative: true,
        }],  // Xat matni
    });

    return message;
  } catch (error: any) {
    console.error("Failed to send mail", error);
    throw error; // Bu yerda to'liq xatolik ob'ektini qaytarish yaxshiroq bo'ladi
  }
};
 
    // const transporter = nodemailer.createTransport({
    //   service: "Gmail", 
    //   auth: {
    //     user: process.env.MAIL_USER,
    //     pass: process.env.MAIL_PASS,
    //   },
    // });
    // const info = await transporter.sendMail({
    //   from: process.env.SENDER_EMAIL,
    //   to: email,
    //   subject: title,
    //   html: body,
    // });
    // console.log("Mail sent successfully", info);
    // return info;