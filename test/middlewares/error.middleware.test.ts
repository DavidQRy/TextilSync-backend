import { describe, it, expect, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import httpMocks from 'node-mocks-http';
import httpStatus from 'http-status';

import errorHandler from '#middlewares/error.middleware';

/**
 * Test suite for the errorHandler middleware
 */
describe('errorHandler middleware', () => {
  /**
   * Creates a typed mock of NextFunction
   */
  const next: NextFunction = vi.fn();

  it('should return 500 status and error message', () => {
    // Arrange
    const error = new Error('Test error');

    const req = httpMocks.createRequest<Request>({
      method: 'GET',
      url: '/test',
    });

    const res = httpMocks.createResponse<Response>();

    // Act
    errorHandler(error, req, res, next);

    // Assert
    expect(res.statusCode).toBe(httpStatus.INTERNAL_SERVER_ERROR);

    const data = res._getJSONData();
    expect(data).toEqual({
      success: false,
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'Test error',
    });
  });

  it('should return default message when error message is empty', () => {
    // Arrange
    const error = new Error('');

    const req = httpMocks.createRequest<Request>();
    const res = httpMocks.createResponse<Response>();

    // Act
    errorHandler(error, req, res, next);

    // Assert
    expect(res.statusCode).toBe(httpStatus.INTERNAL_SERVER_ERROR);

    const data = res._getJSONData();
    expect(data.message).toBe('Internal server error');
  });
});
