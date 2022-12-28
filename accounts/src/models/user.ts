import { model } from 'mongoose';
import { UserSchema } from './schemas';
import { IUser } from './types';

export const User = model<IUser>('user', UserSchema);
