import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "./asyncMiddleware.js";

const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Not authorized. Token missing.");
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // Always re-load the user from the database so deleted or downgraded users lose access.
  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    const error = new Error("User linked to token no longer exists.");
    error.statusCode = 401;
    throw error;
  }

  req.user = user;
  next();
});

const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    const error = new Error("Forbidden. Insufficient permissions.");
    error.statusCode = 403;
    return next(error);
  }

  return next();
};

export { protect, authorize };
