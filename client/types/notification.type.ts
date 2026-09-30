import { IUser } from "./auth.type";

export interface INotification {
  _id: string;
  title: string;
  message: string;
  status: "read" | "unread"
  user: IUser;
  createdAt: string;
  updatedAt: string;
}
export interface INotificationsResponse {
  success: boolean;
  result: number;
  notifications: INotification[];
  pagination: {
    currentPage: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
