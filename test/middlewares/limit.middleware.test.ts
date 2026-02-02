import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import httpMocks from 'node-mocks-http';

import { LIMIT, LIMIT_MESSAGE } from '#config/environment';
import { limiter } from '#middlewares/limit.middleware';

interface MockResponse extends Response {
  _getData: () => string;
  _getJSONData: () => any;
  _isEndCalled: () => boolean;
  _getHeaders: () => any;
  _getStatusCode: () => number;
}

/**
 * Test suite for rate limiter middleware
 */
describe('Rate limiter middleware', () => {
  let req: Request;
  let res: MockResponse;
  let next: NextFunction;

  beforeEach(() => {
    req = httpMocks.createRequest<Request>({
      method: 'GET',
      url: '/test',
      ip: '127.0.0.1',
    });

    res = httpMocks.createResponse<Response>();
    next = vi.fn();
  });

  /**
   * Test: Should skip rate limiting when skip=true
   */
  it('should skip rate limiting when skip is true', async () => {
    // Arrange
    const rateLimiter = limiter(true);

    // Act
    await rateLimiter(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledOnce();
    expect(res.statusCode).toBe(200);
  });

  /**
   * Test: Should block request after exceeding limit
   */
  it('should return 429 when limit is exceeded', async () => {
    // Arrange
    const rateLimiter = limiter(false);

    // Act
    for (let i = 0; i <= Number(LIMIT); i++) {
      await rateLimiter(req, res, next);
    }

    // Assert
    expect(res.statusCode).toBe(429);
    expect(res._getData()).toBe(LIMIT_MESSAGE);
  });

  /**
   * Test: Should allow requests within limit
   */
  it('should allow requests within rate limit', async () => {
    // Arrange
    const rateLimiter = limiter(false);

    // Act
    await rateLimiter(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledOnce();
    expect(res.statusCode).toBe(200);
  });
});