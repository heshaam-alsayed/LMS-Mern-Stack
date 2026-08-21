export type registerFormData = {
  name: string;
  email: string;
  password: string;
};

export type loginFormData = {
  email: string;
  password: string;
}
export type registerResponse = {
  success: boolean;
  message: string;
  verificationToken: string;
};

export type verificationResponse ={
  success : boolean;
  message:string
}

export interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "user" | "instructor" | "admin";
  avatar?: {
    public_Id?: string;
    url?: string;
  };
  isDeleted: boolean;
  isVerified: boolean;
  courses: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: IUser | null;
  verificationToken: string | null;
  loading: boolean;
}

export interface IUpdateUserInfo {
  name?: string;
}

export interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}