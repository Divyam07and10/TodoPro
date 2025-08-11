import * as Joi from 'joi';

export const envSchema = Joi.object({
    PORT:Joi.number().required(),
    DATABASE_URL:Joi.string().required(),
    GOOGLE_CLIENT_ID:Joi.string().required(),
    GOOGLE_CLIENT_SECRET:Joi.string().required(),
    GOOGLE_CALLBACK_URL:Joi.string().required(),
    BASE_URL:Joi.string().required(),
    ACCESS_TOKEN_SECRET:Joi.string().required(),
    ACCESS_TOKEN_EXPIRY:Joi.string().required(),
    REFRESH_TOKEN_SECRET:Joi.string().required(),
    REFRESH_TOKEN_EXPIRY:Joi.string().required(),
    NODE_ENV:Joi.string().required(),
    API_KEY:Joi.string().required(),
});