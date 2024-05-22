import jwt from "jsonwebtoken";

import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import "dotenv/config";

const SECRET_KEY = process.env.SECRET_KEY;

const authenticate = async (req, res, next) => {
  const { authorisation = "" } = req.headers;
  const [bearer, token] = authorisation.split("");
  console.log(SECRET_KEY);

  if (bearer !== "Bearer") {
    next(HttpError(401));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) {
      next(HttpError(401));
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    next(HttpError(401));
  }
};

export default authenticate;
