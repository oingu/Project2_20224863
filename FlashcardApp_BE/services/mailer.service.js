const nodemailer = require("nodemailer");
const systemConfig = require("../config/system");

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    port: process.env.MAIL_PORT || 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const sendOtpEmailRegister = async (to, otp) => {
    const mailOptions = {
        from: `"FlashcardApp Support" <${process.env.MAIL_USER}>`,
        to,
        subject: "Your OTP Code",
        html: `
          <h2>🔐 Your OTP Code</h2>
          <p>Here is your OTP code to register: <b>${otp}</b></p>
          <p>This code will expire in ${systemConfig.otpExpiration} minutes.</p>
        `,
    };
    await transporter.sendMail(mailOptions);
};

const sendOtpEmailChange = async (to, otp) => {
    const mailOptions = {
        from: `"FlashcardApp Support" <${process.env.MAIL_USER}>`,
        to,
        subject: "Email Change Verification Code",
        html: `
          <h2>✉️ Verify Your New Email Address</h2>
          <p>We received a request to change your email address.</p>
          <p>Please enter the following OTP code to confirm this change:</p>
          <h3 style="color: #2e86de;">${otp}</h3>
          <p>This code will expire in ${systemConfig.otpExpiration} minutes. If you did not request this, please ignore this email.</p>
          <br>
          <p>Thank you,<br>The FlashcardApp Team</p>
        `,
    };
    await transporter.sendMail(mailOptions);
};

const sendEmailForgotPassword = async (to, resetUrl) => {
    const mailOptions = {
        from: `"FlashcardApp Support" <${process.env.MAIL_USER}>`,
        to,
        subject: "Password Reset Request",
        html: `
          <h2>🔒 Password Reset Request</h2>
          <p>We received a request to reset your password.</p>
          <p>Please click the link below to reset your password:</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>This link will expire in ${systemConfig.passwordResetExpiration.inNumber} minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
          <br>
          <p>Thank you,<br>The FlashcardApp Team</p>
        `,
    };
    await transporter.sendMail(mailOptions);
};

module.exports.sendOtpEmailRegister = sendOtpEmailRegister;
module.exports.sendOtpEmailChange = sendOtpEmailChange;
module.exports.sendEmailForgotPassword = sendEmailForgotPassword;
