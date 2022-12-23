import { isValidEmail, isStrongPassword } from '../../src/validator/validator';

describe('Email validator', () => {
  it.each([
    'abc', '@gmail', 'abc@example', 'someone.com',
  ])('when email is "%s"', (email) => {
    expect(isValidEmail(email)).toBeFalsy();
  });

  it('Valid email', () => {
    expect(isValidEmail('someone@some-domain.com')).toBeTruthy();
  });
});

describe('Strong password validator', () => {
  it.each([
    'short', 'NOLOWER', 'noupper', 'NoNumbers', 'n0Symbols',
  ])('when password is "%s"', (password) => {
    expect(isStrongPassword(password)).toBeFalsy();
  });

  it('Valid password', () => {
    expect(isStrongPassword('Val|dP4ssword')).toBeTruthy();
  });
});
