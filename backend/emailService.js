const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendVerificationEmail = async (email, name, token) => {
  const verificationLink = `https://recruitment-system-w57t.onrender.com/api/auth/verify/${token}`;
  
  const mailOptions = {
    from: `"HireAI Recruitment" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your HireAI Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #2563EB; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">HireAI</h1>
          <p style="color: #BFDBFE; margin: 5px 0;">Smart Recruitment Platform</p>
        </div>
        <div style="background: #F8FAFC; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1E293B;">Hello ${name}! 👋</h2>
          <p style="color: #64748B; font-size: 15px;">Thank you for registering on HireAI. Please verify your email address to activate your account.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background: #2563EB; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600;">
              Verify My Email
            </a>
          </div>
          <p style="color: #94A3B8; font-size: 13px;">This link will expire in 24 hours.</p>
          <p style="color: #94A3B8; font-size: 13px;">If you did not create an account, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 20px 0;">
          <p style="color: #94A3B8; font-size: 12px; text-align: center;">© 2024 HireAI. All rights reserved.</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};