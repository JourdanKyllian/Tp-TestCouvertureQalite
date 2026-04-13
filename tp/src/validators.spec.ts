import { isValidAge, isValidEmail, isValidPassword } from "./validators";

/*
 * fonction isValidEmail(email)
 */
describe('isValidEmail', () => {
  it('should return true when the email is valid', () => {
    const input = 'user@example.com';
    const result = isValidEmail(input);
    expect(result).toBe(true);
  });
  it('should return true when the email is valid with + characters', () => {
    const input = 'user.name+tag@domain.co';
    const result = isValidEmail(input);
    expect(result).toBe(true);
  })
  it('should return false when the email has no @ and no domain', () => {
    const input = 'invalid';
    const result = isValidEmail(input);
    expect(result).toBe(false);
  });
  it('should return false when the email has no prefix', () => {
    const input = '@domain.com';
    const result = isValidEmail(input);
    expect(result).toBe(false);
  });
  it('should return false when the email has no domain', () => {
    const input = 'user@';
    const result = isValidEmail(input);
    expect(result).toBe(false);
  });
  it('should return false when the email is empty', () => {
    const input = '';
    const result = isValidEmail(input);
    expect(result).toBe(false);
  });
  it('should return false when the email is null', () => {
    const input = null;
    const result = isValidEmail(input);
    expect(result).toBe(false);
  });
  it('should return false when the email has two @', () => {
    const input = 'user@e@xample.com'
    const result = isValidEmail(input);
    expect(result).toBe(false);
  });
});

/*
 * fonction isValidPassword(password)
 */
describe('isValidPassword', () => {
  it('should return true when the password have at least 8 characters, a lowercase letter, an uppercase letter, a number and a special character', () => {
    const input = 'Passw0rd!';
    const expected = { valid: true, errors: [] };
    const result = isValidPassword(input);

    expect(result).toEqual(expected);
  });
  it('should return false when the password is empty', () => {
    const input = '';
    const result = isValidPassword(input);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBe(5);
  });
  it('should return false when the password is null', () => {
    const input = null;
    const result = isValidPassword(input);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBe(5);
  });
  it('should return false when the password have less than 8 characters', () => {
    const input = 'sh0rt!';
    const result = isValidPassword(input);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Minimum 8 caracteres');
  });
  it('Should return false when the password does not have a lowercase letter', () => {
    const input = 'PASSW0RD!';
    const result = isValidPassword(input);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Au moins 1 minuscule');
  });
  it('Should return false when the password does not have an uppercase letter', () => {
    const input = 'passw0rd!';
    const result = isValidPassword(input);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Au moins 1 majuscule');
  });
  it('Should return false when the password does not have a number', () => {
    const input = 'Password!';
    const result = isValidPassword(input);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Au moins 1 chiffre');
  });
  it('Should return false when the password does not have a special character', () => {
    const input = 'Passw0rd';
    const result = isValidPassword(input);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Au moins 1 caractere special');
  });
})

/*
 * fonction isValidAge(age)
 */
describe('IsValidAge', () => {
  it('should return true when the age is between 0 and 150', () => {
    const input = 25;
    const result = isValidAge(input);
    expect(result).toBe(true);
  });
  it('should return true when the age is egal 0', () => {
    const input = 0;
    const result = isValidAge(input);
    expect(result).toBe(true);
  });
  it('should return true when the age is egal 150', () => {
    const input = 150;
    const result = isValidAge(input);
    expect(result).toBe(true);
  });
  it('should return false when the age is less than 0', () => {
    const input = -1;
    const result = isValidAge(input);
    expect(result).toBe(false);
  });
  it('should return false when the age is greater than 150', () => {
    const input = 151;
    const result = isValidAge(input);
    expect(result).toBe(false);
  });
  it('should return false when the age is not a integer', () => {
    const input = 25.5;
    const result = isValidAge(input);
    expect(result).toBe(false);
  });
  it('should return false when the age is not a number', () => {
    const input: string = "25";
    const result = isValidAge(input as any);
    expect(result).toBe(false);
  });
  it('should return false when the age is null', () => {
    const input = null;
    const result = isValidAge(input);
    expect(result).toBe(false);
  });
});