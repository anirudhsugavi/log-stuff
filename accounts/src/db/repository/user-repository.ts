import { hash, compare } from 'bcryptjs';
import { IUser, User } from '../../models';
import { NotFoundError } from '../../util/app-errors';

const SALT_ROUND = 10;

export class UserRepository {
  async createUser(user: IUser): Promise<IUser> {
    user.password = await this.hashPassword(user.password);
    const result = await User.create(user);
    return result;
  }

  async findUser({ _id, username, email }: IUser): Promise<IUser> {
    const user = await User.findById(_id);
    if (user == null) {
      throw new NotFoundError({ description: `user ${username ?? email} not found` });
    }
    return user;
  }

  async hashPassword(password: string): Promise<string> {
    return await hash(password, SALT_ROUND);
  }

  async comparePassword(unhashed: string, hashed: string): Promise<boolean> {
    return await compare(unhashed, hashed);
  }
}
