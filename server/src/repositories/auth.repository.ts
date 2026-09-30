import {
  IRegistrationBody,
  ISocialAuthBody,
} from "../interfaces/userInterface";
import UserModel from "../models/user.model";

const createUser = async (userData: IRegistrationBody) => {
  const { name, email, password } = userData;

  return await UserModel.create({
    name,
    email,
    password,
    provider: "local",
  });
};

const createSocialUser = async (
  userData: ISocialAuthBody,
  provider: "google" | "github",
) => {
  const { email, name, avatar } = userData;

  const user = await UserModel.create({
    email,
    name,
    avatar,
    provider,
    isVerified: true,
  });

  return user;
};

const getUserByEmail = async (email: string) => {
  const user = await UserModel.findOne({ email }).select("-password");
  return user;
};

const findUserByEmail = async (email: string) => {
  return await UserModel.findOne({ email }).select("+password");
};

export const getUserById = async (userId: string) => {
  return await UserModel.findById(userId);
};

export const findUserByIdWithPassword = async (userId: string) => {
  return await UserModel.findById(userId).select("+password");
};

const authRepository = {
  createUser,
  getUserByEmail,
  findUserByEmail,
  getUserById,
  findUserByIdWithPassword,
  createSocialUser,
};
export default authRepository;
