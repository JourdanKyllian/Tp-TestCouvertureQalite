import { isValidEmail, isValidPassword } from "./validators";

/*
 * fonction isValidEmail(email)
 */
describe('isValidEmail', () => {
  it('should return true when the email is valid', () => {
    const input = 'user@example.com';
    const expected = true;
    const result = isValidEmail(input);
    expect(result).toBe(expected);
  });
  it('should return true when the email is valid with + characters', () => {
    const input = 'user.name+tag@domain.co';
    const expected = true;
    const result = isValidEmail(input);
    expect(result).toBe(expected);
  })
  it('should return false when the email has no @ and no domain', () => {
    const input = 'invalid';
    const expected = false;
    const result = isValidEmail(input);
    expect(result).toBe(expected);
  });
  it('should return false when the email has no prefix', () => {
    const input = '@domain.com';
    const expected = false;
    const result = isValidEmail(input);
    expect(result).toBe(expected);
  });
  it('should return false when the email has no domain', () => {
    const input = 'user@';
    const expected = false;
    const result = isValidEmail(input);
    expect(result).toBe(expected);
  });
  it('should return false when the email is empty', () => {
    const input = '';
    const expected = false;
    const result = isValidEmail(input);
    expect(result).toBe(expected);
  });
  it('should return false when the email is null', () => {
    const input = null;
    const expected = false;
    const result = isValidEmail(input);
    expect(result).toBe(expected);
  });
});

/*
 * fonction isValidPassword(password)
 */
describe('isValidPassword', () => {
  it('should return true when the password have at least 8 characters, a lowercase letter, an uppercase letter, a number and a special character', () => {
    const input = 'Passw0rd!';
    const expected = true;
    const result = isValidPassword(input);
    expect(result).toBe(expected);
  });
  it('should return false when the password have less than 8 characters', () => {
    const input = 'short';
    const expected = false;
    const result = isValidPassword(input);
    expect(result).toBe(expected);
  });
  it('should return false when the password is empty', () => {
    const input = '';
    const expected = false;
    const result = isValidPassword(input);
    expect(result).toBe(expected);
  });
  it('should return false when the password is null', () => {
    const input = null;
    const expected = false;
    const result = isValidPassword(input);
    expect(result).toBe(expected);
  });
})