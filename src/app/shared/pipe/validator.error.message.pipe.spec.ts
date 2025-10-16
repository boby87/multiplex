import { ValidatorErrorMessagePipe } from './validator.error.message.pipe';

describe('ValidatorErrorMessagePipe', () => {
  let pipe: ValidatorErrorMessagePipe;

  beforeEach(() => {
    pipe = new ValidatorErrorMessagePipe();
  });

  // Test case for different types of validation errors
  it.each([
    [{ required: true }, 'This field is required.'],
    [{ minlength: { requiredLength: 5, actualLength: 3 } }, 'Minimum length is 5'],
    [{ maxlength: { requiredLength: 10, actualLength: 12 } }, 'Maximum length is 10'],
    [{ pattern: true }, 'Invalid format.'],
    [{ mustMatch: true }, 'Values must match.'],
    [{ min: { min: 5 } }, 'Minimum value is 5'],
    [{ max: { max: 100 } }, 'Maximum value is 100'],
    [{ email: true }, 'Email must be a valid email address'],
    [{}, 'Invalid field.'], // For unknown validation error
    [null, ''], // For null error
    [undefined, ''], // For undefined error
  ])('should transform error %p into message %p', (errors, expectedMessage) => {
    expect(pipe.transform(errors)).toBe(expectedMessage);
  });
});
