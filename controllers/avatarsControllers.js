import * as fs from "node:fs/promises";
import path from "node:path";
import Jimp from "jimp";

import User from "../models/user.js";

export async function getAvatar(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    if (user.avatar === null) {
      return res.status(404).send({ message: "Avatar not found" });
    }

    res.sendFile(path.resolve("public/avatars", user.avatar));
  } catch (error) {
    next(error);
  }
}

export async function uploadAvatar(req, res, next) {
  //перевірка, чи файл існує
  try {
    if (!req.file) {
      return res.status(400).send("Please select the avatar file");
    }

    //використаємо jimp для зміни розмірів аватарки
    const userAvatar = await Jimp.read(req.file.path);
    console.log(req.file.path);
    await userAvatar.cover(250, 250).writeAsync(req.file.path);

    await fs.rename(
      req.file.path,
      path.resolve("public/avatars", req.file.filename)
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: req.file.filename },
      { new: true }
    );

    console.log(req.user);
    console.log({ avatarURL });

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send({ avatarURL });
  } catch (error) {
    next(error);
  }
}
