import { model } from 'mongoose';
import { AccountSchema } from './schemas';
import { IAccount } from './types';

export const Account = model<IAccount>('account', AccountSchema);
