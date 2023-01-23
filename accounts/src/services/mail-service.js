const mailer = require('nodemailer');
const { generateJwt, verifyJwt } = require('../util/crypto-util');
const logger = require('../util/logger');
const props = require('../util/properties-loader');

const transporter = mailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: props.VERIFY_MAIL_USERNAME,
    pass: props.VERIFY_MAIL_PASSWORD,
    clientId: props.VERIFY_MAIL_CLIENT_ID,
    clientSecret: props.VERIFY_MAIL_CLIENT_SECRET,
    refreshToken: props.VERIFY_MAIL_REFRESH_TOKEN,
  },
});

async function sendVerificationEmail({
  email, id, roles, hostname,
}) {
  logger.info('sending verification email', { to: email });

  const token = await generateJwt({ id, secret: props.JWT_SECRET, roles });
  const verifyLink = `${hostname}/user/verify?token=${token}`;

  const mailOptions = {
    from: props.VERIFY_SENDER_EMAIL,
    to: email,
    subject: 'Confirm your email address',
    text: `Follow this link to verify your email: ${verifyLink}`,
  };

  return transporter.sendMail(mailOptions);
}

async function verifyEmail(token) {
  logger.info('verifying email');
  const payload = await verifyJwt({ token, secret: props.JWT_SECRET });
  logger.debug(payload);
  return payload;
}

module.exports = {
  sendVerificationEmail,
  verifyEmail,
};
