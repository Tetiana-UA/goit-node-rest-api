import Joi from "joi";

export const registerUserSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string(),
  password: Joi.string(),
});
