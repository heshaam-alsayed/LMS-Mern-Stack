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
const authRepository = {
  createUser,
  getUserByEmail,
  findUserByEmail,
  getUserById,
  createSocialUser,
};
export default authRepository;
