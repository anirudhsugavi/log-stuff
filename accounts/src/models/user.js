const { model } = require('mongoose');
const { UserSchema } = require('./schemas');

module.exports = model('user', UserSchema);
