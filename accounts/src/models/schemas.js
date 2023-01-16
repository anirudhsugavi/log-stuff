const { Schema } = require('mongoose');
const { hashPassword } = require('../util/crypto-util');

const NameSchema = new Schema({
  first: { type: String },
  middle: { type: String },
  last: { type: String, required: [true, 'last name is required'] },
  nick: { type: String },
});

const UserSchema = new Schema({
  email: { type: String, required: [true, 'email is required'], unique: true },
  password: { type: String, required: [true, 'password is required'] },
  username: {
    type: String,
    unique: true,
    default() {
      return this.email;
    },
  },
  verified: { type: Boolean, default: false },
  name: NameSchema,
  roles: { type: [String], required: [true, 'user should have roles'] },
  avatar: { type: String },
  settings: { type: Map, of: String },
  deleted: { type: Boolean, default: false },
});

UserSchema.pre('save', async function save(next) {
  this.verified = false;
  this.deleted = false;
  this.password = await hashPassword(this.password);
  next();
});

module.exports = {
  NameSchema,
  UserSchema,
};
