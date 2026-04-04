/**
 * Email Utility
 * Handles all email sending via Nodemailer
 */

const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send email
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    // In development, just log the email
    if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_USER) {
      console.log(`📧 Email (DEV MODE - not sent):`);
      console.log(`   To: ${to}`);
      console.log(`   Subject: ${subject}`);
      return { success: true, dev: true };
    }

    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'SkillSwap <noreply@skillswap.com>',
      to,
      subject,
      html,
      text,
    });

    console.log(`📧 Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Email templates
 */
const emailTemplates = {
  swapRequest: (requesterName, skillOffered, skillRequested) => ({
    subject: '🔄 New Skill Swap Request - SkillSwap',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px; border-radius: 12px;">
        <h1 style="color: #6366f1; margin-bottom: 8px;">SkillSwap</h1>
        <h2 style="color: #e2e8f0;">New Swap Request!</h2>
        <p><strong>${requesterName}</strong> wants to exchange skills with you.</p>
        <div style="background: #1e293b; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>🎯 <strong>They offer:</strong> ${skillOffered}</p>
          <p>📚 <strong>They want:</strong> ${skillRequested}</p>
        </div>
        <p>Login to SkillSwap to accept or decline this request.</p>
        <a href="${process.env.CLIENT_URL}/swaps" style="background: #6366f1; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; margin-top: 16px;">View Request</a>
      </div>
    `,
  }),

  swapAccepted: (providerName, skillOffered, skillRequested) => ({
    subject: '✅ Swap Request Accepted - SkillSwap',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px; border-radius: 12px;">
        <h1 style="color: #6366f1;">SkillSwap</h1>
        <h2 style="color: #22c55e;">Request Accepted! 🎉</h2>
        <p><strong>${providerName}</strong> accepted your skill swap request.</p>
        <div style="background: #1e293b; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>🎯 <strong>Skill exchange:</strong> ${skillOffered} ↔ ${skillRequested}</p>
        </div>
        <p>Start chatting to coordinate your swap session!</p>
        <a href="${process.env.CLIENT_URL}/chat" style="background: #22c55e; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; margin-top: 16px;">Open Chat</a>
      </div>
    `,
  }),

  welcome: (name) => ({
    subject: '👋 Welcome to SkillSwap!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px; border-radius: 12px;">
        <h1 style="color: #6366f1;">Welcome to SkillSwap! 🚀</h1>
        <p>Hi <strong>${name}</strong>,</p>
        <p>You've successfully joined the SkillSwap community! Start by adding your skills and discovering others.</p>
        <a href="${process.env.CLIENT_URL}/dashboard" style="background: #6366f1; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; margin-top: 16px;">Go to Dashboard</a>
      </div>
    `,
  }),
};

module.exports = { sendEmail, emailTemplates };
