import bcrypt from "bcrypt";

import User from "../models/user.js";
import { createUserSchema } from "../schemas/usersSchemas.js";
import HttpError from "../helpers/HttpError.js";

async function registration(req, res, next) {
  const { name, email, password } = req.body;

  const emailInLowerCase = email.toLowerCase();

  try {
    //валідація тіла запиту за допомогою Joi
    const { error } = createUserSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const user = await User.findOne({ email: emailInLowerCase });

    if (user !== null) {
      return res.status(409).send({ message: "User already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: emailInLowerCase,
      password: passwordHash,
    });

    res.status(201).send({ message: "Registration successfully" });
  } catch (error) {
    next(error);
  }
}

export default {
  registration,
};
