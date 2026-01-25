export const {
  NODE_ENV,
  PORT = 3000,
  LIMIT = 20,
  LIMIT_MESSAGE = 'Too many requests, please try again later',
  JWT_SECRET,
  JWT_EXPIRES
} = process.env;

export const adminID: string | undefined = process.env.DEFAULT_ROLE_ID