import User from "../models/userModel";
import { Request, Response, NextFunction } from "express";
import CustomError from "../lib/utils/CustomError";
import { getAccessToken, getRefreshToken } from "../lib/utils/jwt";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return next(new CustomError(400, "Please provide all credentials"));
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new CustomError(400, "User already exists"));
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  await User.create({ username, email, password: hashedPassword });
  const user = await User.findOne(
    { email, username },
    { _id: 1, useranme: 1, email: 1 }
  );

  if (!user) {
    return next(new CustomError(404, "User not found"));
  }

  const token = getAccessToken(
    user._id.toString(),
    process.env.JWT_SECRET as string
  );
  const refreshToken = getRefreshToken(
    user._id.toString(),
    process.env.JWT_SECRET as string
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res
    .status(201)
    .json({
      status: "success",
      message: "User created successfully",
      accessToken: token,
      user,
    });
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { identity, password } = req.body;
  if (!identity || !password) {
    return next(new CustomError(400, "Please provide all credentials"));
  }

  const userByemail = await User.findOne(
    { email: identity },
    { username: 1, email: 1, password: 1 }
  );
  let user = userByemail;

  if (!userByemail) {
    const userByUsername = await User.findOne(
      { username: identity },
      { username: 1, email: 1, password: 1 }
    );
    user = userByUsername;
  }

  if (!user) {
    return next(new CustomError(404, "User not found"));
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return next(new CustomError(400, "Invalid credentials"));
  }

  const token = getAccessToken(
    user._id.toString(),
    process.env.JWT_SECRET as string
  );
  const refreshToken = getRefreshToken(
    user._id.toString(),
    process.env.JWT_SECRET as string
  );
  const userDetail = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res
    .status(200)
    .json({
      status: "success",
      message: "User logged in successfully",
      accessToken: token,
      user: userDetail,
    });
};

const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie("refreshToken");
  res
    .status(200)
    .json({ status: "success", message: "User logged out successfully" });
};

const refreshingToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies) {
    return next(new CustomError(401, "Unauthorized"));
  }
  if (!req.cookies.refreshToken) {
    return next(new CustomError(401, "No refresh token found"));
  }
  const refreshToken = req.cookies.refreshToken;
  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string);
  if (!decoded) {
    return next(new CustomError(401, "Invalid refresh token"));
  }
  const user = await User.findById(decoded);
  if (!user) {
    return next(new CustomError(404, "User not found"));
  }

  const accessToken = getAccessToken(
    user._id.toString(),
    process.env.JWT_SECRET as string
  );
  res
    .status(200)
    .json({
      status: "success",
      message: "Token refreshed successfully",
      accessToken,
    });
};

export { registerUser, loginUser, logoutUser, refreshingToken };
