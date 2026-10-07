export type TicketStatus = "open" | "in_progress" | "closed";

export type TicketCategory =
  | "payment"
  | "course"
  | "video"
  | "account"
  | "certificate"
  | "other";

export interface ITicketAttachment {
  url: string;
  publicId: string;
  name: string;
  type: string;
  size: number;
  resourceType?: "image" | "raw";
}

export interface ITicketUser {
  _id: string;
  name: string;
  email: string;
  role: "user" | "instructor" | "admin";
  avatar?: {
    url?: string;
  };
}

export interface ITicket {
  _id: string;
  user: string | ITicketUser;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  assignedTo: string | ITicketUser | null;
  attachments?: ITicketAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface ITicketMessage {
  _id: string;
  ticket: string;
  sender: string | ITicketUser;
  message?: string;
  attachments: ITicketAttachment[];
  createdAt: string;
  updatedAt: string;
  clientId?: string;
}

export interface CreateTicketPayload {
  email: string;
  subject: string;
  category: TicketCategory;
  message: string;
  attachments: File[];
}

export interface CreateTicketResponse {
  success: boolean;
  message: string;
  ticket: ITicket;
  ticketMessage: ITicketMessage;
}

export interface GetTicketResponse {
  success: boolean;
  ticket: ITicket;
}

export interface GetTicketMessagesResponse {
  success: boolean;
  messages: ITicketMessage[];
}

export interface ListTicketsParams {
  page?: number;
  limit?: number;
  status?: TicketStatus | "all";
}

export interface ListTicketsResponse {
  success: boolean;
  tickets: ITicket[];
  total: number;
  totalPages: number;
  allTotal: number;
  page: number;
  limit: number;
}

export interface AcceptTicketResponse {
  success: boolean;
  message: string;
  ticket: ITicket;
}
