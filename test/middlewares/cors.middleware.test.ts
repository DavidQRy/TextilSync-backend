import { describe, it, expect, vi } from 'vitest';
import { cors } from '#middlewares/cors.middleware';
import { createRequest, createResponse } from 'node-mocks-http';
import type { NextFunction, Request, Response } from 'express';

/**
 * Test suite for the CORS middleware.
 *
 * This suite verifies that the middleware:
 * - Adds default CORS headers
 * - Skips header injection when configured
 * - Allows customization of origin, methods, and headers
 */
describe('CORS Middleware', () => {
  /**
   * Test: should add default CORS headers when no options are provided.
   *
   * Expected behavior:
   * - Adds Access-Control-Allow-Origin = "*"
   * - Adds default methods and headers
   * - Calls next() exactly once
   */
  it('should add default CORS headers', () => {
    /** Mocked Express request */
    const req: Request = createRequest();

    /** Mocked Express response */
    const res: Response = createResponse();

    /** Mocked Express next function */
    const next: NextFunction = vi.fn();

    cors({})(req, res, next);

    expect(res.getHeader('Access-Control-Allow-Origin')).toBe('*');
    expect(res.getHeader('Access-Control-Allow-Methods')).toBe(
      'GET, POST, PUT, DELETE'
    );
    expect(res.getHeader('Access-Control-Allow-Headers')).toBe(
      'Content-Type, Authorization'
    );
    expect(next).toHaveBeenCalledOnce();
  });

  /**
   * Test: should not add any CORS headers when skip option is enabled.
   *
   * Expected behavior:
   * - No headers are added to the response
   * - next() is still called
   */
  it('should not add headers when skip option is true', () => {
    const req: Request = createRequest();
    const res: Response = createResponse();
    const next: NextFunction = vi.fn();

    cors({ skip: true })(req, res, next);

    expect(res.getHeaders()).toEqual({});
    expect(next).toHaveBeenCalledOnce();
  });

  /**
   * Test: should allow custom origin and HTTP methods.
   *
   * Expected behavior:
   * - Origin header matches the provided value
   * - Methods are uppercased and joined correctly
   * - next() is called
   */
  it('should allow custom origin and methods', () => {
    const req: Request = createRequest();
    const res: Response = createResponse();
    const next: NextFunction = vi.fn();

    cors({
      origin: 'https://test.com',
      methods: ['get', 'post'],
    })(req, res, next);

    expect(res.getHeader('Access-Control-Allow-Origin')).toBe(
      'https://test.com'
    );
    expect(res.getHeader('Access-Control-Allow-Methods')).toBe('GET, POST');
    expect(next).toHaveBeenCalledOnce();
  });

  /**
   * Test: should allow custom allowed headers.
   *
   * Expected behavior:
   * - Access-Control-Allow-Headers reflects the provided list
   * - next() is called
   */
  it('should allow custom headers', () => {
    const req: Request = createRequest();
    const res: Response = createResponse();
    const next: NextFunction = vi.fn();

    cors({
      headers: ['X-Custom', 'Authorization'],
    })(req, res, next);

    expect(res.getHeader('Access-Control-Allow-Headers')).toBe(
      'X-Custom, Authorization'
    );
    expect(next).toHaveBeenCalledOnce();
  });
});
