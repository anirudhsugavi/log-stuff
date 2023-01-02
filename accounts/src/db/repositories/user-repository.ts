import { IUser, User } from '../../models';
import { NotFoundError } from '../../util/app-errors';
import logger from '../../util/logger';

export class UserRepository {
  async createUser(user: IUser): Promise<IUser> {
    logger.debug('creating user', user);
    const result = await User.create(user);
    return result;
  }

  async findUser({ _id, username, email }: IUser): Promise<IUser> {
    logger.debug('find userById', { _id, username, email });
    const user = await User.findById(_id);
    if (user == null) {
      throw new NotFoundError({ description: `user ${username ?? email} not found` });
    }
    return user;
  }

  async updateUser(existing: IUser, toUpdate: IUser): Promise<IUser> {
    logger.debug('updating user', existing, toUpdate);
    const user = await User.findByIdAndUpdate(existing._id, toUpdate);
    if (user == null) {
      throw new NotFoundError({ description: `user ${existing.username ?? existing.email} not found` });
    }
    return user;
  }
}
