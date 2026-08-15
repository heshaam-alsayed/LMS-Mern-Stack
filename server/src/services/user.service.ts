import { IUpdatePassword, IUpdateUserInfo } from "../interfaces/userInterface";
import userRepository from "../repositories/user.repository";
import AppError from "../utils/AppError";
import redis from "../utils/redis";
import cloudinary from "cloudinary";

export const getUserById = async (userId: string) => {
  if (!userId) {
    throw new AppError("User id is required", 400);
  }

  const cachedUser = await redis.get(userId);

  if (cachedUser) {
    return JSON.parse(cachedUser);
  }

  const user = await userRepository.getUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }
  // 🔥 cache result
  await redis.set(userId, JSON.stringify(user)); // 1 hour

  return user;
};

export const getMe = async (userId: string) => {
  if (!userId) {
    throw new AppError("User id is required", 400);
  }

  const cachedUser = await redis.get(userId);
  console.log("Cached user for ID", userId, ":", cachedUser);
  if (cachedUser) {
    return JSON.parse(cachedUser);
  }

  
  const user = await userRepository.getUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }
  user.password = undefined as any;
  await redis.set(
    userId,
    JSON.stringify(user),
    "EX",
    7 * 24 * 60 * 60, // 7 days cache
  );
  return user;
};

export const updateUserInfo = async (userId: string, body: IUpdateUserInfo) => {
  const { name } = body;
  if (!userId) {
    throw new AppError("User id is required", 400);
  }
  let user = await userRepository.getUserById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  if (name && user) {
    user.name = name;
  }

  const updatedUser = await user.save();
  await redis.set(userId, JSON.stringify(updatedUser));

  return updatedUser;
};

export const updatePassword = async (userId: string, body: IUpdatePassword) => {
  const { oldPassword, newPassword } = body;
  if (!oldPassword || !newPassword) {
    throw new AppError("Old password and new password are required", 400);
  }
  const user = await userRepository.getUserById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.password) {
    throw new AppError("This account was created with provider.", 400);
  }
  // check old password
  const isMatch = await user.comparePassword(oldPassword);
  console.log("Password match result for user:", userId, "isMatch:", isMatch);
  if (!isMatch) {
    throw new AppError("Old password is incorrect", 400);
  }

  // set new password
  user.password = newPassword;

  await user.save();
  await redis.set(userId, JSON.stringify(user));
  return user;
};

export const updateAvatar = async (userId: string, avatar: string) => {
  if (!userId) {
    throw new AppError("User id is required", 400);
  }

  if (!avatar) {
    throw new AppError("Avatar is required", 400);
  }

  const user = await userRepository.getUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // delete old avatar
  if (user.avatar?.public_Id) {
    await cloudinary.v2.uploader.destroy(user.avatar.public_Id);
  }

  // upload new avatar
  const result = await cloudinary.v2.uploader.upload(avatar, {
    folder: "avatars",
    width: 150,
  });

  // update avatar
  user.avatar = {
    public_Id: result.public_id,
    url: result.secure_url,
  };

  const updatedUser = await user.save();

  // update cache
  await redis.set(userId, JSON.stringify(updatedUser));

  return updatedUser;
};
export const changeRole = async (
  userId: string,
  role: "user" | "instructor" | "admin",
) => {
  if (!userId) {
    throw new AppError("User id is required", 400);
  }

  if (!role) {
    throw new AppError("Role is required", 400);
  }

  const user = await userRepository.getUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.role = role;

  const updatedUser = await user.save();

  await redis.set(userId, JSON.stringify(updatedUser));

  return updatedUser;
};

export const toggleUserDeleted = async (userId: string) => {
  if (!userId) {
    throw new AppError("User id is required", 400);
  }

  const user = await userRepository.getUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const updatedUser = await userRepository.toggleUserDeleted(
    userId,
    !user.isDeleted,
  );
  if (updatedUser?.isDeleted) {
    await redis.del(userId);
  } else {
    await redis.set(userId, JSON.stringify(updatedUser));
  }
  return updatedUser;
};

export const getUsers = async () => {
  return await userRepository.getUsers();
};

const userService = {
  getUserById,
  updateUserInfo,
  getMe,
  updatePassword,
  updateAvatar,
  getUsers,
  changeRole,
  toggleUserDeleted,
};
export default userService;
