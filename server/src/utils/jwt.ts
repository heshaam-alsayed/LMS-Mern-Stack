import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { IRegistrationBody, IUser } from "../interfaces/userInterface";
import AppError from "./AppError";
import redis from "./redis";
import { StringValue } from "ms";

interface IActivationToken {
  token: string;
  activationCode: string;
}

export interface IJwtPayload {
  user: IRegistrationBody;
  activationCode: string;
}

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

export const createActivationToken = (
  user: IRegistrationBody,
): IActivationToken => {
  const activationCode = Math.floor(100000 + Math.random() * 900000).toString();

  const payload: IJwtPayload = {
    user,
    activationCode,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN as any,
  });

  return {
    token,
    activationCode,
  };
};

export const createResetPasswordToken = (user: IUser): string => {
  return jwt.sign(
    { id: user._id.toString() },
    process.env.JWT_SECRET as string,
    {
      expiresIn: (process.env.RESET_TOKEN_EXPIRE as StringValue) || "10m",
    },
  );
};

export const verifyResetPasswordToken = (token: string): { id: string } => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    if (!decoded.id) {
      throw new AppError("Invalid reset token payload", 400);
    }

    return decoded;
  } catch {
    throw new AppError("Reset token is invalid or expired", 400);
  }
};

export const verifyActivationToken = (
  token: string,
  code: string,
): IRegistrationBody => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as IJwtPayload;

    if (!decoded?.activationCode) {
      throw new AppError("Invalid Token Payload", 400);
    }

    if (decoded.activationCode !== code) {
      throw new AppError("Invalid Activation Code", 400);
    }

    return decoded.user;
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }

    throw new AppError("Token is invalid or expired", 400);
  }
};

export const accessExpireMin = parseInt(
  process.env.ACCESS_TOKEN_EXPIRE as string,
);
export const refreshExpireDays = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE as string,
);

// cookies config
export const accessCookieOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessExpireMin * 60 * 1000),
  maxAge: accessExpireMin * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

export const refreshCookieOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshExpireDays * 24 * 60 * 60 * 1000),
  maxAge: refreshExpireDays * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

// SEND TOKENS
export const sendToken = async (user: IUser) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  // clean session
  await redis.set(
    user._id.toString(),
    JSON.stringify(user),
    "EX",
    refreshExpireDays * 24 * 60 * 60,
  );

  return { accessToken, refreshToken };
};

// REFRESH FLOW
export const handleRefreshAccessToken = async (token: string) => {
  if (!token) throw new AppError("Refresh token required", 400);

  let decoded: JwtPayload & { id: string };

  try {
    decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as Secret,
    ) as any;
  } catch {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const session = await redis.get(decoded.id);

  if (!session) {
    throw new AppError("Session expired", 401);
  }

  const user = JSON.parse(session);
  const userId = user._id?.toString() ?? user.id;

  const accessToken = jwt.sign(
    { id: userId, role: user.role },
    process.env.ACCESS_TOKEN_SECRET as Secret,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE as StringValue },
  );

  const newRefreshToken = jwt.sign(
    { id: userId, role: user.role },
    process.env.REFRESH_TOKEN_SECRET as Secret,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE as StringValue },
  );

  await redis.set(
    userId,
    JSON.stringify(user),
    "EX",
    refreshExpireDays * 24 * 60 * 60,
  );

  return { accessToken, newRefreshToken };
};
