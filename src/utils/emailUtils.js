// src/utils/emailUtils.js
import transport from '../config/mailing.js';

export const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: 'tu-email@gmail.com', // Asegúrate de que coincida con config.gmailUser
        to,
        subject,
        text,
    };

    return transport.sendMail(mailOptions);
};
