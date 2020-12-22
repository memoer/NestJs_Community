import { registerAs } from '@nestjs/config';
import * as Joi from '@hapi/joi';

export const appSchema = {
  NODE_ENV: Joi.string()
    .valid('production', 'development', 'test')
    .required(),
  SECRET_KEY: Joi.string().required(),
};

export default registerAs('APP_CONFIG', () => ({
  env: process.env.NODE_ENV,
  secretKey: process.env.SECRET_KEY,
}));
