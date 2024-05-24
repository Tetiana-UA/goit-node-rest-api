import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";

import User from "../models/user.js";
import {
  registerUserSchema,
  loginUserSchema,
} from "../schemas/usersSchemas.js";

import HttpError from "../helpers/HttpError.js";

const SECRET_KEY = process.env.SECRET_KEY;

//регістрація
export async function registration(req, res, next) {
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
    const avatarURL = gravatar.url(email);

    await User.create({
      email: emailInLowerCase,
      password: passwordHash,
      avatarURL,
    });

    res.status(201).send({ message: "Registration successfully" });
  } catch (error) {
    next(error);
  }
}

//логін
export async function login(req, res, next) {
  const { email, password } = req.body;
  console.log(req.body);

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

    //створюємо токен і перезаписуємо його в базу
    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

    await User.findByIdAndUpdate(user._id, { token });

    res.send({ token });
  } catch (error) {
    next(error);
  }
}

//current
export async function current(req, res, next) {
  try {
    const { email } = req.user;
    res.json({
      email,
    });
  } catch (error) {
    next(error);
  }
}

//розлогування
export async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
