const nodemailer = require("nodemailer");
const env = require("../config/env");

function getTransport() {
  if (!env.smtpHost || !env.smtpUser || !env.smtpPass) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass
    }
  });
}

async function sendMail({ to, subject, html }) {
  const transport = getTransport();

  if (!transport) {
    console.log(`Email skipped: ${subject} -> ${to}`);
    return;
  }

  await transport.sendMail({
    from: env.mailFrom,
    to,
    subject,
    html
  });
}

module.exports = { sendMail };
