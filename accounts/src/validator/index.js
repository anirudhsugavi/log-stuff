const validator = require('validator');

function isValidEmail(email) {
  return email && validator.isEmail(email);
}

function isStrongPassword(password) {
  return password && validator.isStrongPassword(password, {
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });
}

function isValidUsername(username) {
  return username && username.length >= 6 && /^[\w-]+$/.test(username);
}

module.exports = {
  isValidEmail,
  isStrongPassword,
  isValidUsername,
};
