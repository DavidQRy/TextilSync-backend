import { describe, it, expect, vi } from 'vitest';

import Joi from 'joi';
import validate from '#middlewares/validate';
import { createRequest, createResponse }from 'node-mocks-http';

// const mockResponse = () => {
//   const res: any = {};
//   res.status = vi.fn().mockReturnValue(res);
//   res.json = vi.fn().mockReturnValue(res);
//   return res;
// };


describe('validate middleware', () => {

  it('should call next when body is valid', () => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
    });

    const req = createRequest({
      method: 'POST',
      body: {
        email: 'test@mail.com',
      },
    });

    const res = createResponse();
    const next = vi.fn();

    validate(schema)(req as any, res as any, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.statusCode).toBe(200); 
  });

  it('should return 400 when body is invalid', () => {
      const schema = Joi.object({
      email: Joi.string().email().required(),
    });

    const req = createRequest({
      method: 'POST',
      body: {
        email: 'not-an-email',
      },
    });

    const res = createResponse();
    const next = vi.fn();

    validate(schema)(req, res, next);
    expect(res.statusCode).toBe(400);
    const data = res._getJSONData();
    expect(data.message).toBeDefined();

    expect(next).not.toHaveBeenCalled();
  });

  it('should replace req.body with validated value', () => {
    const schema = Joi.object({
      name: Joi.string().trim().required(),
    });
  
    const req = createRequest({
      method: 'POST',
      body: {
        name: '   Juan   ',
      },
    });
  
    const res = createResponse();
    const next = vi.fn();
  
    validate(schema)(req, res, next);
  
    expect(req.body.name).toBe('Juan');
  });

});
