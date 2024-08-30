const emailForgotTemplate = (otp: string, name: string) => {
  return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>OTP Verification Email</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
    
            .cta {
                display: inline-block;
                padding: 10px 20px;
                background-color: #FFD60A;
                color: #000000;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
    
            .highlight {
                font-weight: bold;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
            <a href=""><img class="logo"
                    src="https://i.ibb.co/0mGsMPn/book-posts-logo.png" alt="Book Posts Logo"></a>
                    <div class="message">OTP Tasdiqlash Emaili</div>
                    <div class="body">
                            <p>Hurmatli Adminstrator</p>
                            <p>Sizga Savdo5jiek.uz saytida Adminstrator yokiy Soliq agent sifatida. Ro'yxatdan o'tishni yakunlash uchun, iltimos, quyidagi OTP
                                    (Bir martalik parol) dan foydalanib hisobini tasdiqlang:</p>
                            <h2 class="highlight">${otp}</h2>
                            <p>Ushbu OTP 5 daqiqa davomida amal qiladi. Agar siz bu tasdiqlashni so'ramagan bo'lsangiz, iltimos, ushbu emailni e'tiborsiz qoldiring.
                            Hisobingiz tasdiqlangandan so'ng, platformamiz va uning imkoniyatlaridan foydalanishingiz mumkin bo'ladi.</p>
                    </div>
                    <div class="support">Agar sizda biron bir savol bo'lsa yoki yordam kerak bo'lsa, iltimos, biz bilan bog'laning <a
                                    href="mailto:sunnatullox83@gmail.com">sunnatullox83@gmail.com</a>. Biz yordam berish uchun shu yerdamiz!</div>
            </div>
    </body>
    
    </html>`;
};

export default emailForgotTemplate;
