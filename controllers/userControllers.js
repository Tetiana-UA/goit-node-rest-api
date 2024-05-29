import * as fs from "node:fs/promises";
import path from "node:path";
import Jimp from "jimp";

import User from "../models/user.js";
import { emailSchema } from "../schemas/usersSchemas.js";
import HttpError from "../helpers/HttpError.js";
import mail from "../mail.js";

//оновлення аватаpа
export async function uploadAvatar(req, res, next) {
  //перевірка, чи файл існує
  try {
    if (!req.file) {
      return res.status(400).send("Please select the avatar file");
    }

    //використаємо jimp для зміни розмірів аватарки
    const avatarURL = await Jimp.read(req.file.path);
    console.log(req.file.path);
    await avatarURL.cover(250, 250).writeAsync(req.file.path);

    await fs.rename(
      req.file.path,
      path.resolve("public/avatars", req.file.filename)
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: req.file.filename },
      { new: true }
    );

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send({ avatarURL });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

//підтвердження пошти користувача по посиланні у листі
export async function verifyEmail(req, res, next) {
  const { token } = req.params;

  try {
    const user = await User.findOne({ verifyToken: token });

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    await User.findByIdAndUpdate(user._id, { verify: true, verifyToken: null });

    res.status(200).send({ message: "Email confirm successfully" });
  } catch (error) {
    next(error);
  }
}

// повторна відправка листа на підтвердження пошти користувача по посиланні у листі
export async function resendVerifyEmail(req, res, next) {
  const { email } = req.body;
  console.log(req.body);

  try {
    //валідація тіла запиту(email) за допомогою Joi
    const { error } = emailSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send({ message: "Email not found" });
    }

    if (user.verify) {
      return res.status(401).send({ message: "Email already verify" });
    }

    mail.sendMail({
      to: email,
      from: "izidaxm5a@gmail.com",
      subject: "Verify email",
      html: `To confirm your email please click on the <a href="http://localhost:3000/api/users/verify/${user.verifyToken}">link</a>`,
      text: `To confirm your email please open the link http://localhost:3000/api/users/verify/${user.verifyToken}`,
    });

    res.status(200).send({ message: "Verify email send successfully" });
  } catch (error) {
    next(error);
  }
}
