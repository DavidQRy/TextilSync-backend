import { beforeEach, describe, expect, it, vi } from 'vitest';
import {createRequest, createResponse} from 'node-mocks-http';
import { errorPath } from '#middlewares/errorPath.middleware';
import status from 'http-status';
import { Request, Response, NextFunction } from 'express';

interface MockResponse extends Response {
  _getData: () => string;
  _getJSONData: () => Response;
  _isEndCalled: () => boolean;
  _getHeaders: () => any;
  _getStatusCode: () => number;
}

describe('ErrorPath Middleware', () => {
  let req: Request;
  let res: MockResponse;
  let next: NextFunction;

  beforeEach(() => {
    req = createRequest({
      url: '/ruta-desconocida',
      originalUrl: '/ruta-desconocida'
    });
    res = createResponse();
    next = vi.fn();
  });

  it('debe devolver información de ruta y estado 429', () => {
    errorPath(req, res, next);
    const { _getJSONData :data } = res;

    expect(res.statusCode).toBe(status.NOT_FOUND);
    expect(data()).toEqual({
      status: status.NOT_FOUND,
      message: 'Ruta no encontrada',
      path: '/ruta-desconocida'
    });
  });

  it('debe devolver un objeto JSON como respuesta', () => {
    errorPath(req, res, next);
    const { _getJSONData :data } = res;

    expect(typeof data()).toBe('object');
    expect(data()).toHaveProperty('status');
    expect(data()).toHaveProperty('message');
    expect(data()).toHaveProperty('path');
  });
});