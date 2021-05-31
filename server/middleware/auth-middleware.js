import jwt from "jsonwebtoken";
import config from "config";

/**
 * TODO: проверять что токен принадлежит соответствующему user_id
 */

const AuthMiddleware = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next;
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

export default AuthMiddleware;
