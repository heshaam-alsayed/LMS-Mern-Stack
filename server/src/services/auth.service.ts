import {
  IActivationRequest,
  IForgotPasswordRequest,
  ILoginRequest,
  IRegistrationBody,
  IResetPasswordRequest,
  ISocialAuthBody,
} from "../interfaces/userInterface";
import authRepository from "../repositories/auth.repository";
import AppError from "../utils/AppError";
import {
  createActivationToken,
  createResetPasswordToken,
  sendToken,
  verifyActivationToken,
  verifyResetPasswordToken,
} from "../utils/jwt";
import sendEmail from "../utils/SendEmail";
import { Response } from "express";
import jwt from "jsonwebtoken";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

export const register = async (body: IRegistrationBody) => {
  const { name, email, password } = body;
  if (!name || !email || !password) {
    throw new AppError("name , email , password are required", 404);
  }

  const isExistingUser = await authRepository.getUserByEmail(body.email);
  console.log(isExistingUser);
  if (isExistingUser) {
    throw new AppError("Email already exists", 400);
  }

  const user: IRegistrationBody = {
    name,
    email,
    password,
  };
  const { activationCode, token } = createActivationToken(user);

  const emailData = {
    userName: user.name,
    activationCode,
  };

  await sendEmail({
    email: user.email,
    subject: "Activate Your Account",
    template: "activation-mail.ejs",
    data: emailData,
  });

  return token;
};

export const activateUser = async (body: IActivationRequest) => {
  const { activation_token, activation_code } = body;

  // 1 verify token + code
  const userData = verifyActivationToken(activation_token, activation_code);

  // 2. check if user already exists
  const isExistingUser = await authRepository.getUserByEmail(userData.email);

  if (isExistingUser) {
    throw new AppError("Email already exists", 400);
  }
  // 3. create user
  const user = await authRepository.createUser(userData);
  return user;
};

export const login = async (body: ILoginRequest) => {
  const { email, password } = body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    throw new AppError("Invalid Email or Password", 400);
  }

  if (user.status === "pending") {
    throw new AppError(
      "Your account is pending approval. You cannot login until your organization application is approved.",
      403,
    );
  }

  if (user.status === "suspended") {
    throw new AppError("Your account has been suspended.", 403);
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw new AppError("Invalid Email or Password not match", 400);
  }
  return user;
};

export const handleSocialAuth = async (body: ISocialAuthBody) => {
  const { email } = body;
  let user = await authRepository.findUserByEmail(email);

  if (!user) {
    user = await authRepository.createSocialUser(body);
  }
  const { accessToken, refreshToken } = await sendToken(user);

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const forgotPassword = async (
  body: IForgotPasswordRequest,
): Promise<void> => {
  const { email } = body;

  if (!email) {
    throw new AppError("Email is required", 400);
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!emailRegex.test(normalizedEmail)) {
    throw new AppError("Please enter a valid email address", 400);
  }

  const user = await authRepository.findUserByEmail(normalizedEmail);

  if (!user) {
    return;
  }

  const resetToken = createResetPasswordToken(user);

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  await sendEmail({
    email: user.email,
    subject: "Reset Your Password",
    template: "reset-password-mail.ejs",
    data: {
      userName: user.name,
      resetUrl,
    },
  });
};

export const resetPassword = async (
  body: IResetPasswordRequest,
): Promise<void> => {
  const { token, password } = body;

  if (!token) {
    throw new AppError("Reset token is required", 400);
  }

  if (!password) {
    throw new AppError("New password is required", 400);
  }

  const decoded = verifyResetPasswordToken(token);

  const user = await authRepository.findUserByIdWithPassword(decoded.id);

  if (!user) {
    throw new AppError("Reset token is invalid or expired", 400);
  }

  user.password = password;

  await user.save();
};

export default {
  register,
  activateUser,
  login,
  handleSocialAuth,
  forgotPassword,
  resetPassword,
};
