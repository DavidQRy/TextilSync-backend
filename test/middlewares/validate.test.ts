import { describe, it, expect, vi } from 'vitest';

import Joi from 'joi';
import validate from '#middlewares/validate';

const mockResponse = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};


describe('validate middleware', () => {

  it('should call next when body is valid', () => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
    });

    const req: any = {
      body: {
        email: 'test@mail.com',
      },
    };

    const res = mockResponse();
    const next = vi.fn();

    validate(schema)(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 400 when body is invalid', () => {
      const schema = Joi.object({
      email: Joi.string().email().required(),
    });

    const req: any = {
      body: {
        email: 'not-an-email',
      },
    };

    const res = mockResponse();
    const next = vi.fn();

    validate(schema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('should replace req.body with validated value', () => {
    const schema = Joi.object({
      name: Joi.string().trim().required(),
    });
  
    const req: any = {
      body: {
        name: '   Juan   ',
      },
    };
  
    const res = mockResponse();
    const next = vi.fn();
  
    validate(schema)(req, res, next);
  
    expect(req.body.name).toBe('Juan');
  });

});
