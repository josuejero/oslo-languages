// src/utils/__tests__/api-utils.test.ts

import { validateRequest, ApiError, validators } from '../api-utils';

describe('API Utilities', () => {
  describe('validateRequest', () => {
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      age: 25
    };

    it('validates data correctly', () => {
      // Include all required validators: name, email, and age
      const validations = {
        name: validators.required('name'),
        email: validators.email(),
        age: validators.required('age')
      };

      const errors = validateRequest(testData, validations);
      expect(errors).toHaveLength(0);
    });

    it('returns errors for invalid data', () => {
      const validations = {
        name: validators.required('name'),
        email: validators.email(),
        age: validators.required('age')
      };

      const errors = validateRequest({ ...testData, email: 'invalid' }, validations);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('email');
    });
  });

  describe('ApiError', () => {
    it('creates error with correct properties', () => {
      const error = new ApiError('Test error', 400, { details: 'test' });
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.data).toEqual({ details: 'test' });
    });
  });
});
