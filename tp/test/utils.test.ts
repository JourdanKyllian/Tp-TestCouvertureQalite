import { calculateAverage, capitalize, clamp, slugify } from "src/utils";

/**
 * fonction capitalize(str)
 */
describe('capitalize', () => {
  it('should capitalize the first letter of a string when it is not already capitalized', () => {
    const input = 'hello';
    const expected = 'Hello';
    const result = capitalize(input);
    expect(result).toBe(expected);
  });
  it('should lowercase the string then capitalize the first letter when the string is on uppercase', () => {
    const input = 'WORLD';
    const expected = 'World';
    const result = capitalize(input);
    expect(result).toBe(expected);
  });
  it('should return an empty string when the input is an empty string', () => {
    const input = '';
    const expected = '';
    const result = capitalize(input);
    expect(result).toBe(expected);
  })
  it('should return an empty string when the input is null', () => {
    const input = null;
    const expected = '';
    const result = capitalize(input);
    expect(result).toBe(expected);
  });
});

/**
 * fonction calculateAverage(numbers)
 */
describe('calculateAverage', () => {
  it('should return the exact average when given an array of integers', () => {
    const input = [10, 12, 14];
    const expected = 12;
    const result = calculateAverage(input);
    expect(result).toBe(expected);
  });
  it('should return the single number when array contains only one element', () => {
    const input = [15];
    const expected = 15;
    const result = calculateAverage(input);
    expect(result).toBe(expected);
  })
  it('should return 0 when the array is empty', () => {
    const input = [];
    const expected = 0;
    const result = calculateAverage(input);
    expect(result).toBe(expected);
  });
  it('should return the exact average when given an array of integers', () => {
    const input = [10, 11, 12];
    const expected = 11.33;
    const result = calculateAverage(input);
    expect(result).toBe(expected);
  });
  it('should return 0 when array is null', () => {
    const input = null;
    const expected = 0;
    const result = calculateAverage(input);
    expect(result).toBe(expected);
  });
});

/**
 * fonction slugify(text)
 */
describe('slugify', () => {
  it('should return the string as a slug when it is not', () => {
    expect(slugify('Hello World')).toBe('hello-world');
    const input = 'Hello World';
    const expected = 'hello-world';
    const result = slugify(input);
    expect(result).toBe(expected);
  })
  it('should return the string without spaces when it contains spaces', () => {
    const input = ' Spaces Everywhere ';
    const expected = 'spaces-everywhere';
    const result = slugify(input);
    expect(result).toBe(expected);
  });
  it('should return the string without special characters when it contains special characters', () => {
    const input = 'C\'est l\'ete !';
    const expected = 'cest-lete';
    const result = slugify(input);
    expect(result).toBe(expected);
  });
  it('should return an empty string when the input is an empty string', () => {
    const input = '';
    const expected = '';
    const result = slugify(input);
    expect(result).toBe(expected);
  });
});

/**
 * fonction clamp(value, min, max)
 */
describe('clamp', () => {
  it('should return the value when it is between min and max', () => {
    const value = 5;
    const min = 0;
    const max = 10;
    const expected = 5;
    const result = clamp(value, min, max);
    expect(result).toBe(expected);
  });
  it('should return the min value when the value is less than min', () => {
    const value = -5;
    const min = 0;
    const max = 10;
    const expected = 0;
    const result = clamp(value, min, max);
    expect(result).toBe(expected);
  });
  it('should return the max value when the value is greater than max', () => {
    const value = 15;
    const min = 0;
    const max = 10;
    const expected = 10;
    const result = clamp(value, min, max);
    expect(result).toBe(expected);
  });
  it('should return the value when min and max are the same', () => {
    const value = 0;
    const min = 0;
    const max = 0;
    const expected = 0;
    const result = clamp(value, min, max);
    expect(result).toBe(expected);
  })
})