import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "instructor" | "admin";
  avatar: {
    public_Id: string;
    url: string;
  };
  isDeleted?: boolean;
  isVerified?: boolean;
  courses: mongoose.Types.ObjectId[]; // array of course IDs the user is enrolled
  comparePassword(password: string): Promise<boolean>; // takes a plain password and compares it with the hashed password in the database
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

export interface IRegistrationBody {
  name: string;
  email: string;
  password?: string;
  avatar?: {
    public_Id: string;
    url: string;
  };
  role?: "user" | "instructor" | "admin"; // optional, defaults to "student"
}


export interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ISocialAuthBody {
  email: string;
  name: string;
  avatar?: {
    public_Id?: string;
    url: string;
  };
}
export interface IUpdateUserInfo {
  name?: string;
  email?: string;
}
export interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}


