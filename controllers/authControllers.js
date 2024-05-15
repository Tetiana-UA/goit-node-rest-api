import bcrypt from "bcrypt";

import User from "../models/user.js";
import {
  registerUserSchema,
  loginUserSchema,
} from "../schemas/usersSchemas.js";

import HttpError from "../helpers/HttpError.js";

//регістрація
async function registration(req, res, next) {
  const { email, password } = req.body;

  const emailInLowerCase = email.toLowerCase();

  try {
    //валідація тіла запиту за допомогою Joi
    const { error } = registerUserSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const user = await User.findOne({ email: emailInLowerCase });

    //перевірка, чи такого email ще не було зареєстровано
    if (user !== null) {
      return res.status(409).send({ message: "Email in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
      email: emailInLowerCase,
      password: passwordHash,
    });

    res.status(201).send({ message: "Registration successfully" });
  } catch (error) {
    next(error);
  }
}

//логін
async function login(req, res, next) {
  const { email, password } = req.body;

  const emailInLowerCase = email.toLowerCase();

  try {
    //валідація тіла запиту за допомогою Joi
    const { error } = loginUserSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const user = await User.findOne({ email: emailInLowerCase });
    //перевірка, чи є зареєстрований  користувач з таким email
    if (user === null) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    //перевірка, чи є зареєстрований  користувач з таким password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch === false) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    res.status(200).send({ message: "Login successfully" });
  } catch (error) {
    next(error);
  }
}

export default {
  registration,
  login,
};
