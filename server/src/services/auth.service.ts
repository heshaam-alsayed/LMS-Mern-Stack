import {
  IActivationRequest,
  ILoginRequest,
  IRegistrationBody,
  ISocialAuthBody,
} from "../interfaces/userInterface";
import authRepository from "../repositories/auth.repository";
import AppError from "../utils/AppError";
import {
  createActivationToken,
  sendToken,
  verifyActivationToken,
} from "../utils/jwt";
import sendEmail from "../utils/SendEmail";
import { Response } from "express";

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
  console.log(user);
  console.log(user?.role);
  if (!user) {
    throw new AppError("Invalid Email choose another", 400);
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw new AppError("Invalid Email or Password", 400);
  }

  return user;
};

export const handleSocialAuth = async (body: ISocialAuthBody) => {
  const { email } = body;
  let user = await authRepository.findUserByEmail(email);
  console.log(user);
  console.log(user?.role);
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

export default {
  register,
  activateUser,
  login,
  handleSocialAuth,
};
