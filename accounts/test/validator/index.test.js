const { isValidEmail, isStrongPassword, isValidUsername } = require('../../src/validator');

describe('Email validator', () => {
  it.each([
    'abc', '@gmail', 'abc@example', 'someone.com', null, undefined,
  ])('when email is "%s"', (email) => {
    expect(isValidEmail(email)).toBeFalsy();
  });

  it('valid email', () => {
    expect(isValidEmail('someone@some-domain.com')).toBeTruthy();
  });
});

describe('Strong password validator', () => {
  it.each([
    'short', 'NOLOWER', 'noupper', 'NoNumbers', 'n0Symbols', null, undefined,
  ])('when password is "%s"', (password) => {
    expect(isStrongPassword(password)).toBeFalsy();
  });

  it('valid password', () => {
    expect(isStrongPassword('Val|dP4ssword')).toBeTruthy();
  });
});

describe('Username validator', () => {
  it.each([
    'abcd', 'no-special_ch@rs', 'No-āccents', null, undefined,
  ])('when username is "%s"', (username) => {
    expect(isValidUsername(username)).toBeFalsy();
  });

  it('valid username', () => {
    expect(isValidUsername('Valid-user_name')).toBeTruthy();
  });
});
