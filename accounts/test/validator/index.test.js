const {
  isValidEmail, isStrongPassword, isValidUsername, isValidRoles, isValidId,
} = require('../../src/validator');

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

describe('Roles validator', () => {
  it.each([
    [['invalid']], [['']], [['InVaLID', 'NOPE']], [[]], null, undefined,
  ])('when roles is "%s"', (roles) => {
    expect(isValidRoles(roles)).toBeFalsy();
  });

  it.each([
    [['admin']], [['read', 'write']], [['read', 'write', 'delete']],
  ])('when roles is "%s"', (roles) => {
    expect(isValidRoles(roles)).toBeTruthy();
  });
});

describe('ID validator', () => {
  it.each([
    '123', '123abc', '1234567890abc', '1234567890ab1234567890zz', null, undefined,
  ])('when ID is "%s"', (id) => {
    expect(isValidId(id)).toBeFalsy();
  });

  it.each([
    '1234567890ab', '1234567890ab1234567890ff',
  ])('when ID is "%s"', (id) => {
    expect(isValidId(id)).toBeTruthy();
  });
});
