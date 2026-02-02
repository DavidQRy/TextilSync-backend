import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authenticate } from '#middlewares/auth.middleware';
import { createRequest, createResponse } from 'node-mocks-http';
import jwt from 'jsonwebtoken';

/**
 * Mock de jsonwebtoken
 */
vi.mock('jsonwebtoken', () => ({
  default: {
    verify: vi.fn(),
  },
}));

/**
 * Mock de variables de entorno
 */
vi.mock('#config/environment', () => ({
  JWT_SECRET: 'test-secret',
}));

describe('authenticate middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Should return 403 if Authorization header is missing
   */
  it('should return 403 when token is not provided', () => {
    const req = createRequest();
    const res = createResponse();
    const next = vi.fn();

    authenticate(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toEqual({
      message: 'Token no proporcionado',
      code: 403,
    });
    expect(next).not.toHaveBeenCalled();
  });

  /**
   * Should return 403 if Authorization header does not start with Bearer
   */
  it('should return 403 when token does not start with Bearer', () => {
    const req = createRequest({
      headers: {
        authorization: 'Token abc123',
      },
    });

    const res = createResponse();
    const next = vi.fn();

    authenticate(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toEqual({
      message: 'Token no proporcionado',
      code: 403,
    });
    expect(next).not.toHaveBeenCalled();
  });

  /**
   * Should return 401 if token is invalid
   */
  it('should return 401 when token is invalid', () => {
    vi.mocked(jwt.verify).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const req = createRequest({
      headers: {
        authorization: 'Bearer invalid-token',
      },
    });

    const res = createResponse();
    const next = vi.fn();

    authenticate(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({
      message: 'Token inválido o expirado',
      code: 401,
    });
    expect(next).not.toHaveBeenCalled();
  });

  /**
   * Should attach user to request and call next when token is valid
   */
  it('should attach user to req and call next when token is valid', () => {
    vi.mocked(jwt.verify as ReturnType<typeof vi.fn>).mockReturnValue({
      userId: 1,
      email: 'test@mail.com',
      roleId: 1,
    });

    const req = createRequest({
      headers: {
        authorization: 'Bearer valid-token',
      },
    });

    const res = createResponse();
    const next = vi.fn();

    authenticate(req, res, next);

    expect(req.user).toEqual({
      userId: 1,
      email: 'test@mail.com',
      roleId: 1,
    });

    expect(next).toHaveBeenCalledOnce();
  });

  /**
   * Should return 401 if decoded token has invalid format
   */
  it('should return 401 if decoded token is a string', () => {
    vi.mocked(jwt.verify as ReturnType<typeof vi.fn>).mockReturnValue('invalid-payload');

    const req = createRequest({
      headers: {
        authorization: 'Bearer valid-token',
      },
    });

    const res = createResponse();
    const next = vi.fn();

    authenticate(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({
      message: 'Token inválido o expirado',
      code: 401,
    });
    expect(next).not.toHaveBeenCalled();
  });
  /**
 * Should throw error if JWT_SECRET is not configured
 */
it('should throw error when JWT_SECRET is undefined', async () => {
  vi.resetModules();

  vi.doMock('#config/environment', () => ({
    JWT_SECRET: undefined,
  }));

  const { authenticate } = await import('#middlewares/auth.middleware');

  const req = createRequest({
    headers: {
      authorization: 'Bearer valid-token',
    },
  });

  const res = createResponse();
  const next = vi.fn();

  expect(() => authenticate(req, res, next)).toThrow(
    'JWT_SECRET no está configurado'
  );
});
});
