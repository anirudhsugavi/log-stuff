const validator = require('validator');
const { isValidObjectId } = require('mongoose');
const { USER_ROLES } = require('../util/constants');

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

function isValidRoles(roles) {
  return roles && roles.every((role) => USER_ROLES.includes(role));
}

function isValidId(id) {
  return id && isValidObjectId(id);
}

module.exports = {
  isValidEmail,
  isStrongPassword,
  isValidUsername,
  isValidRoles,
  isValidId,
};
