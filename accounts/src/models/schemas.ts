import { Schema, Types } from 'mongoose';
import { IName, IUser, IRole, IAccount } from './types';

export const NameSchema = new Schema<IName>({
  first: { type: String },
  middle: { type: String },
  last: { type: String, required: [true, 'last name is required'] },
  nick: { type: String },
});

export const RoleSchema = new Schema<IRole>({
  type: String,
  required: [true, 'user should have roles'],
  enum: ['read', 'write', 'delete', 'admin'],
});

export const UserSchema = new Schema<IUser>({
  email: { type: String, required: [true, 'email is required'], unique: true },
  password: { type: String, required: [true, 'password is required'] },
  username: {
    type: String,
    unique: true,
    default: function (this: IUser) {
      return this.email;
    },
  },
  verified: { type: Boolean, default: false },
  name: NameSchema,
  account: {
    type: Types.ObjectId,
    ref: 'account',
    required: [true, 'user must be associated to an account'],
  },
  roles: [RoleSchema],
  avatar: { type: String },
});

export const AccountSchema = new Schema<IAccount>({
  name: { type: String, required: [true, 'account name is required'] },
  settings: {
    type: Types.Map,
    of: String,
  },
});
