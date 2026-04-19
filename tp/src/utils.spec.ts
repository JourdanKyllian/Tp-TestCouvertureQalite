import {
  calculateAverage,
  capitalize,
  clamp,
  slugify,
  sortStudents,
  Student,
} from './utils';

/*
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
  });
  it('should return an empty string when the input is null', () => {
    const input = null;
    const expected = '';
    const result = capitalize(input);

    expect(result).toBe(expected);
  });
});

/*
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
  });
  it('should return 0 when the array is empty', () => {
    const input: number[] = [];
    const expected = 0;
    const result = calculateAverage(input);

    expect(result).toBe(expected);
  });
  it('should return the exact average when given an array of integers', () => {
    const input = [10, 11, 12];
    const expected = 11;
    const result = calculateAverage(input);

    expect(result).toBe(expected);
  });
  it('should return 0 when array is null', () => {
    const input = null;
    const expected = 0;
    const result = calculateAverage(input);

    expect(result).toBe(expected);
  });
  it('should return decimal when array give decimal', () => {
    const input = [1, 2, 7];
    const expected = 3.33;
    const result = calculateAverage(input);

    expect(result).toBe(expected);
  });
});

/*
 * fonction slugify(text)
 */
describe('slugify', () => {
  it('should return the string as a slug when it is not', () => {
    const input = 'Hello World';
    const expected = 'hello-world';
    const result = slugify(input);

    expect(result).toBe(expected);
  });
  it('should return the string without spaces when it contains spaces', () => {
    const input = ' Spaces Everywhere ';
    const expected = 'spaces-everywhere';
    const result = slugify(input);

    expect(result).toBe(expected);
  });
  it('should return the string without special characters when it contains special characters', () => {
    const input = "C'est l'ete !";
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

/*
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
  });
});

/*
 * fonction Sort(students, sortBy, order)
 */
describe('sortStudents', () => {
  it('should return empty array when the input is null', () => {
    const input = null;
    const result = sortStudents(input, 'grade', 'asc');

    expect(result).toEqual([]);
  });
  it('should return empty array when the array is empty', () => {
    const input: Student[] = [];
    const result = sortStudents(input, 'grade', 'asc');

    expect(result).toEqual([]);
  });
  it('should sort students by grade ascending', () => {
    const input = [new Student('Alice', 15, 20), new Student('Bob', 10, 22)];
    const result = sortStudents(input, 'grade', 'asc');

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Bob');
    expect(result[1].name).toBe('Alice');
  });
  it('should sort students by grade descending', () => {
    const input = [new Student('Alice', 15, 20), new Student('Bob', 10, 22)];
    const result = sortStudents(input, 'grade', 'desc');

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Alice');
    expect(result[1].name).toBe('Bob');
  });
  it('should sort students by name ascending', () => {
    const input = [new Student('Alice', 15, 20), new Student('Bob', 10, 22)];
    const result = sortStudents(input, 'name', 'asc');

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Alice');
    expect(result[1].name).toBe('Bob');
  });
  it('should sort students by age ascending', () => {
    const input = [
      new Student('Alice', 15, 20),
      new Student('Bob', 10, 22),
      new Student('Charlie', 17, 19),
    ];
    const result = sortStudents(input, 'age', 'asc');

    expect(result).toHaveLength(3);
    expect(result[0].name).toBe('Charlie');
    expect(result[1].name).toBe('Alice');
    expect(result[2].name).toBe('Bob');
  });
  it('should not modify the original array', () => {
    const input = [
      new Student('Alice', 15, 20),
      new Student('Bob', 10, 22),
      new Student('Charlie', 17, 24),
    ];
    sortStudents(input, 'grade', 'asc');

    expect(input).toHaveLength(3);
    expect(input[0].name).toBe('Alice');
  });
  it('should default to ascending order', () => {
    const input = [
      new Student('Alice', 15, 20),
      new Student('Bob', 10, 22),
      new Student('Charlie', 17, 24),
    ];
    const result = sortStudents(input, 'grade');

    expect(result).toHaveLength(3);
    expect(result[0].name).toBe('Bob');
    expect(result[1].name).toBe('Alice');
    expect(result[2].name).toBe('Charlie');
  });
});
