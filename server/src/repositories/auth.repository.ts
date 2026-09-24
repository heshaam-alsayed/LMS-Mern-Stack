import {
  IRegistrationBody,
  ISocialAuthBody,
} from "../interfaces/userInterface";
import UserModel from "../models/user.model";

const createUser = async (userData: IRegistrationBody) => {
  return await UserModel.create(userData);
};

const createSocialUser = async (userData: ISocialAuthBody) => {
  console.log(userData);
  const user = await UserModel.create({
    ...userData,
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
