
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Get token from cookies or headers
    const token =
      req.cookies?.accessToken || 
      req.headers["authorization"]?.split(" ")[1];

    console.log("Token received in middleware:", token);

    if (!token) throw new ApiError(401, "Unauthorized request");

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded._id).select("-password -refreshToken");
    if (!user) throw new ApiError(401, "Invalid access token");

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT error:", error.message);
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
