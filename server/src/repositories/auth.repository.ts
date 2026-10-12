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

// atomic: only mints a new token when the account exists (local provider) and
// the cooldown has elapsed, so concurrent requests can't create/email several
const setPasswordResetToken = async (
  email: string,
  tokenHash: string,
  expiresAt: Date,
  requestedAt: Date,
  cooldownCutoff: Date,
) => {
  return await UserModel.findOneAndUpdate(
    {
      email,
      provider: "local",
      isDeleted: { $ne: true },
      $or: [
        { passwordResetRequestedAt: { $exists: false } },
        { passwordResetRequestedAt: null },
        { passwordResetRequestedAt: { $lte: cooldownCutoff } },
      ],
    },
    {
      $set: {
        passwordResetToken: tokenHash,
        passwordResetExpires: expiresAt,
        passwordResetRequestedAt: requestedAt,
      },
    },
    { new: true },
  );
};

// atomic consume: rejects invalid, expired and already-used tokens in one step
const consumePasswordResetToken = async (tokenHash: string) => {
  return await UserModel.findOneAndUpdate(
    {
      passwordResetToken: tokenHash,
      passwordResetExpires: { $gt: new Date() },
      isDeleted: { $ne: true },
    },
    {
      $unset: {
        passwordResetToken: 1,
        passwordResetExpires: 1,
        passwordResetRequestedAt: 1,
      },
    },
    { new: true },
  );
};

// rollback only the token we just created (never a newer one)
const clearPasswordResetToken = async (tokenHash: string) => {
  return await UserModel.findOneAndUpdate(
    { passwordResetToken: tokenHash },
    {
      $unset: {
        passwordResetToken: 1,
        passwordResetExpires: 1,
        passwordResetRequestedAt: 1,
      },
    },
  );
};

const authRepository = {
  createUser,
  getUserByEmail,
  findUserByEmail,
  getUserById,
  findUserByIdWithPassword,
  createSocialUser,
  setPasswordResetToken,
  consumePasswordResetToken,
  clearPasswordResetToken,
};
export default authRepository;
