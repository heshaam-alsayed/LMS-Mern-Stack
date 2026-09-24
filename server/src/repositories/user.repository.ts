import { ICreateNewMember, IUpdateUserInfo } from "../interfaces/userInterface";
import UserModel from "../models/user.model";

const getUserById = (id: string) => {
  return UserModel.findById(id).select("+password");
};
const findUserByEmail = async (email: string) => {
  return UserModel.findOne({ email }).select("+password");
};
const getUserCourses = (id: string) => {
  return UserModel.findById(id).select("-password").populate("courses");
};

const getSafeUser = (id: string) => {
  return UserModel.findById(id).select("-password");
};
export const getUserByEmail = async (email: string) => {
  return await UserModel.findOne({ email , isDeleted: false });
};

export const createUser = async (userData: any) => {
  return await UserModel.create(userData);
};
export const deleteUserById = async (userId: string) => {
  return await UserModel.findByIdAndDelete(userId);
};

export const updateUserInfo = async (
  userId: string,
  updateData: IUpdateUserInfo,
) => {
  return await UserModel.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });
};

export const getUsers = async () => {
  return await UserModel.find().sort({ createdAt: -1 }).select("-password");
};

export const toggleUserDeleted = async (userId: string, value: boolean) => {
  return UserModel.findByIdAndUpdate(
    userId,
    { isDeleted: value },
    { new: true },
  );
};
const userRepository = {
  getUserById,
  updateUserInfo,
  getUserByEmail,
  getUsers,
  toggleUserDeleted,
  createUser,
  getSafeUser,
  getUserCourses,
  findUserByEmail,
};

export default userRepository;
