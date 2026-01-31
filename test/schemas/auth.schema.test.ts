import { loginSchema, registerSchema } from '#schemas/auth.schema';
import { describe, it, expect } from 'vitest';


describe('Auth Schemas - Login', () => {

  it('should pass with valid login data', () => {
    const data = {
      email: 'test@mail.com',
      password: '12345678',
    };

    const { error } = loginSchema.validate(data);

    expect(error).toBeUndefined();
  });

  it('should fail if email is missing', () => {
    const data = {
      password: '12345678',
    };

    const { error } = loginSchema.validate(data);
    if (error) {
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe('El email es obligatorio');
    }
  });

  it('should fail if password is too short', () => {
    const data = {
      email: 'test@mail.com',
      password: '123',
    };

    const { error } = loginSchema.validate(data);

    expect(error).toBeDefined();
  });

});

describe('Auth Schemas - Register', () => {

  it('should pass with valid register data', () => {
    const data = {
      user: {
        fullName: 'Juan Perez',
        email: 'juan@mail.com',
        password: '12345678',
      },
      company: {
        name: 'TextilSync SAS',
        taxId: '900123456',
      },
    };

    const { error } = registerSchema.validate(data);

    expect(error).toBeUndefined();
  });

  it('should fail if user is missing', () => {
    const data = {
      company: {
        name: 'TextilSync SAS',
        taxId: '900123456',
      },
    };

    const { error } = registerSchema.validate(data);
    if (error) {
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe('"user" is required');
    }
  });

  it('should fail if company taxId is missing', () => {
    const data = {
      user: {
        fullName: 'Juan Perez',
        email: 'juan@mail.com',
        password: '12345678',
      },
      company: {
        name: 'TextilSync SAS',
      },
    };

    const { error } = registerSchema.validate(data);

    if (error) {
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe('El NIT / Tax ID es obligatorio');
    }

  });

});
