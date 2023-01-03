const { model } = require('mongoose');
const { AccountSchema } = require('./schemas');

module.exports = model('account', AccountSchema);
