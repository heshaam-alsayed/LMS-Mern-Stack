import type { ITicket } from "@/types/ticket.type";

const getAssignedToId = (ticket: ITicket) => {
  const assignedTo = ticket.assignedTo;

  if (!assignedTo || typeof assignedTo === "string") return null;

  return assignedTo._id;
};

/**
 * An admin can open a ticket while it is still open, or once it is assigned
 * to them. The server enforces the same rule.
 */
export const canAdminViewTicket = (ticket: ITicket, adminId?: string) => {
  if (ticket.status === "open") return true;

  if (!adminId) return false;

  return getAssignedToId(ticket) === adminId;
};

export const isAssignedToAdmin = (ticket: ITicket, adminId?: string) => {
  if (!adminId) return false;

  return getAssignedToId(ticket) === adminId;
};

export const hasAdminAcceptedTicket = (ticket: ITicket, adminId?: string) => {
  return isAssignedToAdmin(ticket, adminId);
};