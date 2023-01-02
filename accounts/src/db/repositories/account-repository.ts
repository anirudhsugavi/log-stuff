import { Account, IAccount } from '../../models';
import { NotFoundError } from '../../util/app-errors';

export class AccountRepository {
  async createAccount(account: IAccount): Promise<IAccount> {
    const result = await Account.create(account);
    return result;
  }

  async findAccount({ _id, name }: IAccount): Promise<IAccount> {
    const account = await Account.findById(_id);
    if (account == null) {
      throw new NotFoundError({ description: `account ${name} not found` });
    }
    return account;
  }
}
