import validator from 'validator';

export function isValidEmail(email: string): boolean {
  return validator.isEmail(email);
}

export function isStrongPassword(password: string): boolean {
  return validator.isStrongPassword(password, {
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });
}
