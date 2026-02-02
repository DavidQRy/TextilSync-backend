import { describe, it, expect, vi } from 'vitest';
import { authorizeRole } from '#middlewares/role.middleware';
import { createRequest, createResponse } from 'node-mocks-http';

/**
 * Test suite for authorizeRole middleware
 */
describe('authorizeRole middleware', () => {
  /**
   * Should return 401 when user is not authenticated
   */
  it('should return 401 if user is not authenticated', () => {
    const req = createRequest();
    const res = createResponse();
    const next = vi.fn();

    const middleware = authorizeRole(1);

    middleware(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({
      message: 'No autenticado',
      code: 401,
    });
    expect(next).not.toHaveBeenCalled();
  });

  /**
   * Should return 403 when user role is not allowed
   */
  it('should return 403 if user does not have required role', () => {
    const req = createRequest({
      user: {
        roleId: 2,
      },
    });

    const res = createResponse();
    const next = vi.fn();

    const middleware = authorizeRole(1);

    middleware(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toEqual({
      message: 'No tienes permisos para esta acción',
      code: 403,
    });
    expect(next).not.toHaveBeenCalled();
  });

  /**
   * Should call next when user role is allowed
   */
  it('should call next if user has required role', () => {
    const req = createRequest({
      user: {
        roleId: 1,
      },
    });

    const res = createResponse();
    const next = vi.fn();

    const middleware = authorizeRole(1, 2);

    middleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.statusCode).toBe(200);
  });
});
