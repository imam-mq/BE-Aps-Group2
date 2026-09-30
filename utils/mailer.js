const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

async function sendResetEmail(to, resetLink) {
    await transporter.sendMail({
        from: `"APS Group 2" <${process.env.GMAIL_USER}>`,
        to,
        subject: "Reset Password Admin",
        html: `
            <p>Halo,</p>
            <p>Ada permintaan reset password untuk akun kamu.</p>
            <p>Klik link berikut untuk membuat password baru (berlaku 15 menit):</p>
            <p><a href="${resetLink}">${resetLink}</a></p>
            <p>Kalau kamu tidak merasa meminta ini, abaikan saja email ini.</p>
        `,
    });

    console.log(`Email reset password terkirim ke: ${to}`);
}

module.exports = { sendResetEmail };