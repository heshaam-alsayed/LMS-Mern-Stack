import {
  ICreateNewMember,
  IUpdatePassword,
  IUpdateRole,
  IUpdateUserInfo,
} from "../interfaces/userInterface";
import orderRepository from "../repositories/order.repository";
import userRepository from "../repositories/user.repository";
import AppError from "../utils/AppError";
import {
  delCached,
  getCached,
  sanitizeUser,
  sessionKey,
  setCached,
  userPublicKey,
} from "../utils/redis";
import cloudinary from "cloudinary";
import { getUserCoursesProgressService } from "./courseProgress.service";
import { Types } from "mongoose";

/** keep the session and the public profile cache in sync after a user write */
const refreshUserSessionCache = async (userId: string, user: any) => {
  const safe = sanitizeUser(user);
  await setCached(sessionKey(userId), safe, 7 * 24 * 60 * 60);
  await delCached(userPublicKey(userId));
};

export const getUserById = async (userId: string) => {
  if (!userId) {
    throw new AppError("User id is required", 400);
  }

  // public profile is its own short-lived cache, never the session
  const cachedUser = await getCached<Record<string, unknown>>(
    userPublicKey(userId),
  );

  if (cachedUser) {
    return cachedUser;
  }

  const user = await userRepository.getSafeUser(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  await setCached(userPublicKey(userId), user, 300);

  return user;
};

export const createUser = async (data: ICreateNewMember) => {
  const { name, email, password, role } = data;
  if (!name || !email || !password) {
    throw new AppError("name , email , password are required", 404);
  }
  // check user is Exist
  const isExistingUser = await userRepository.getUserByEmail(email);
  if (isExistingUser) {
    throw new AppError("Email already exists", 400);
  }

  const user: ICreateNewMember = {
    name,
    email,
    password,
    role,
    isVerified: true,
  };
  await userRepository.createUser(user);
};

export const getMe = async (userId: string) => {
  if (!userId) {
    throw new AppError("User id is required", 400);
  }

  const cachedUser = await getCached<Record<string, unknown>>(
    sessionKey(userId),
  );

  if (cachedUser) {
    return sanitizeUser(cachedUser);
  }

  const user = await userRepository.getUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const safe = sanitizeUser(user);
  await setCached(sessionKey(userId), safe, 7 * 24 * 60 * 60);
  return safe;
};

export const updateUserInfo = async (userId: string, body: IUpdateUserInfo) => {
  const { name, phone } = body;
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

  if (phone !== undefined) {
    const trimmedPhone = phone.trim();

    if (!trimmedPhone) {
      user.phone = undefined;
    } else {
      if (!/^(010|011|012|015)\d{8}$/.test(trimmedPhone)) {
        throw new AppError(
          "Phone number must be 11 digits and start with 010, 011, 012, or 015",
          400,
        );
      }

      user.phone = trimmedPhone;
    }
  }

  const updatedUser = await user.save(); 
  // update user in cache
  await refreshUserSessionCache(userId, updatedUser);

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

  if (user.provider !== "local") {
    throw new AppError(
      "Password change is not available for this account",
      400,
    );
  }

  if (!user.password) {
    throw new AppError("This account was created with provider.", 400);
  }
  // check old password
  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    throw new AppError("Old password is incorrect", 400);
  }

  // set new password
  user.password = newPassword;

  await user.save();
  await refreshUserSessionCache(userId, user);
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
  await refreshUserSessionCache(userId, updatedUser);

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

  await refreshUserSessionCache(userId, updatedUser);

  return updatedUser;
};

export const enrolledUserCourses = async (userId: string) => {
  if (!userId) {
    throw new AppError("User id is required", 400);
  }
  const user = await userRepository.getUserCourses(userId);
  if (!user) {
    throw new AppError("user not found", 400);
  }
  return user;
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
    await delCached(sessionKey(userId));
    await delCached(userPublicKey(userId));
  } else {
    await refreshUserSessionCache(userId, updatedUser);
  }
  return updatedUser;
};

export const getUsers = async () => {
  return await userRepository.getUsers();
};

export const getOperationUser = async (userId: string) => {
  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid user ID", 400);
  }
  const [user, orders, progress] = await Promise.all([
    userRepository.getSafeUser(userId),
    orderRepository.getUserOrders(userId),
    getUserCoursesProgressService(userId),
  ]);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  const completedCourses = progress.filter(
    (item) => item?.progressPercentage === 100,
  ).length;

  const notStartedCourses = progress.filter(
    (item) => item?.progressPercentage === 0,
  ).length;

  const totalSpent = orders.reduce((total, order) => total + order.price, 0);

  return {
    user,
    statistics: {
      totalCourses: orders.length,
      completedCourses,
      notStartedCourses,
      totalSpent,
    },
    courses: orders.map((order) => ({
      course: order.course,
      purchase: {
        _id: order._id,
        price: order.price,
        createdAt: order.createdAt,
        paymentInfo: order.paymentInfo,
      },
      progress: progress.find(
        (item) => item?.course._id.toString() === order.course._id.toString(),
      ),
    })),
    orders,
  };
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
  createUser,
  enrolledUserCourses,
  getOperationUser,
};
export default userService;
