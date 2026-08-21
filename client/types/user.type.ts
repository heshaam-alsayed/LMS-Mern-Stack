export type UserRole = "user" | "instructor" | "admin";

export interface UserAvatar {
  public_Id?: string;
  url?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;

  role: UserRole;

  avatar?: UserAvatar;

  isDeleted: boolean;
  isVerified: boolean;

  courses: string[];

  createdAt: string;
  updatedAt: string;
}

export type UsersResponseAdmin = {
  success: boolean;
  users: User[];
  result: number;
  pagination: {
    currentPage: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export type CreateNewMember = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export type UpdateMemberData = {
  role: UserRole;
};

export type EditingMember = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export type UpdateRoleBody = {
  role: "user" | "admin" | "instructor";
  id: string;
};

export type SelectedMember = {
  _id: string;
  name: string;
  email: string;
};
