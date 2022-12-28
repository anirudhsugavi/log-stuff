import { ObjectId, Document } from 'mongoose';

export interface IName {
  first?: string;
  middle?: string;
  last: string;
  nick?: string;
}

export enum IRole {
  admin, read, write, delete
}

export interface IUser extends Document {
  _id: ObjectId;
  email: string;
  password: string;
  username?: string;
  verified?: boolean;
  name: IName;
  account: IAccount;
  roles: IRole[];
  avatar?: string;
}

export interface IAccount extends Document {
  _id: ObjectId;
  name: string;
  settings?: Record<string, string>;
}
