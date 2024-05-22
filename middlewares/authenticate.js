import jwt from "jsonwebtoken";

import User from "../models/user";
import HttpError from "../helpers/HttpError.js";

const SECRET_KEY = process.env;

const authenticate = async (req, res, next) => {
  const { authorisation = "" } = req.headers;
  const [bearer, token] = authorisation.split("");

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
  } catch {
    next(HttpError(401));
  }
};

export default authenticate;
