import { hash, compare } from 'bcryptjs';
import { BadRequestError } from './app-errors';
import logger from './logger';

const SALT_ROUND = 10;
const requireNonNull = (...strings: string[]): void => {
  if (strings.length < 1) {
    throw new BadRequestError({ description: 'insufficient number of arguments', errorStack: new RangeError() });
  }

  strings.forEach((str) => {
    if (str == null) {
      throw new BadRequestError({ description: 'argument is null/undefined' });
    }
    if (str.trim().length < 1) {
      throw new BadRequestError({ description: 'argument is empty' });
    }
  });
};

export async function hashPassword(password: string): Promise<string> {
  logger.debug('hashing password', { 'salt-round': SALT_ROUND });
  requireNonNull(password);
  return await hash(password, SALT_ROUND);
}

export async function comparePassword(unhashed: string, hashed: string): Promise<boolean> {
  logger.debug('comparing passwords');
  requireNonNull(unhashed, hashed);
  return await compare(unhashed, hashed);
};
