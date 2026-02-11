import { describe, it, expect } from 'vitest';
import { userCreateSchema, userUpdateSchema } from '#schemas/user.schema';

describe('User Schemas - Create', () => {

  it('should pass with valid create user data', () => {
    const data = {
      email: 'test@mail.com',
      fullName: 'Test User',
      password: '12345678',
      roleId: 1,
    };

    const { error } = userCreateSchema.validate(data);

    expect(error).toBeUndefined();
  });

  it('should fail if email is missing', () => {
    const data = {
      fullName: 'Test User',
      password: '12345678',
      roleId: 1,
    };

    const { error } = userCreateSchema.validate(data);

    if (error) {
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe('El email es obligatorio');
    }
  });

  it('should fail if email is invalid', () => {
    const data = {
      email: 'invalid-email',
      fullName: 'Test User',
      password: '12345678',
      roleId: 1,
    };

    const { error } = userCreateSchema.validate(data);

    if (error) {
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe('El email no es válido');
    }
  });

  it('should fail if password is too short', () => {
    const data = {
      email: 'test@mail.com',
      fullName: 'Test User',
      password: '123',
      roleId: 1,
    };

    const { error } = userCreateSchema.validate(data);

    expect(error).toBeDefined();
  });

  it('should fail if roleId is not positive', () => {
    const data = {
      email: 'test@mail.com',
      fullName: 'Test User',
      password: '12345678',
      roleId: -1,
    };

    const { error } = userCreateSchema.validate(data);

    expect(error).toBeDefined();
  });

});

describe('User Schemas - Update', () => {

  it('should pass with one valid field', () => {
    const data = {
      fullName: 'Updated User',
    };

    const { error } = userUpdateSchema.validate(data);

    expect(error).toBeUndefined();
  });

  it('should pass when updating active status', () => {
    const data = {
      active: true,
    };

    const { error } = userUpdateSchema.validate(data);

    expect(error).toBeUndefined();
  });

  it('should fail if body is empty', () => {
    const data = {};

    const { error } = userUpdateSchema.validate(data);

    expect(error).toBeDefined();
  });

  it('should fail if active is not boolean', () => {
    const data = {
      active: 'true',
    };

    const { error } = userUpdateSchema.validate(data);

    if (error) {
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe(
        'El campo active debe ser verdadero o falso'
      );
    }
  });

  it('should fail if unknown field is provided', () => {
    const data = {
      unknownField: 'test',
    };

    const { error } = userUpdateSchema.validate(data);

    expect(error).toBeDefined();
  });

});
