import { acceptTicketService, closeTicketService, createTicketWithFirstMessage, getAdminTicketDetailsService, getAdminTicketHistory, getTicketDetails, getTicketHistory, listAssignedTicketsService, listMyTicketsService, listTicketsService } from "../services/ticket.service";
import { NextFunction, Request, Response } from "express";
import { TicketStatus } from "../models/ticket.model";



export const createTicket = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, subject, category, message } = req.body;

    const files = (req.files ?? []) as Express.Multer.File[];

    const result = await createTicketWithFirstMessage({
      user: req.user?._id.toString() || "",
      email,
      subject,
      category,
      message,
      files,
    });

    return res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      ticket: result.ticket,
      ticketMessage: result.ticketMessage,
    });
  } catch (error) {
    return next(error);
  }
};

export const getTicket = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ticket = await getTicketDetails(req.params.ticketId as string);

    return res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    return next(error);
  }
};

export const getTicketMessages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const messages = await getTicketHistory(req.params.ticketId as string);

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    return next(error);
  }
};

export const acceptTicket = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ticketId = req.params.ticketId as string;

    const adminId = req.user?._id.toString() || "";

    const ticket = await acceptTicketService(ticketId, adminId);

    return res.status(200).json({
      success: true,
      message: "Ticket accepted successfully",
      ticket,
    });
  } catch (error) {
    return next(error);
  }
};

export const listTickets = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status?.toString() as TicketStatus;

    const result = await listTicketsService({ page, limit, status });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return next(error);
  }
};

export const listMyTickets = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?._id.toString() || "";

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status?.toString() as TicketStatus;

    const result = await listMyTicketsService({
      userId,
      page,
      limit,
      status,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return next(error);
  }
};

export const listAssignedTickets = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const adminId = req.user?._id.toString() || "";

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status?.toString() as TicketStatus;

    const result = await listAssignedTicketsService({
      adminId,
      page,
      limit,
      status,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getAdminTicket = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const adminId = req.user?._id.toString() || "";

    const ticket = await getAdminTicketDetailsService(
      req.params.ticketId as string,
      adminId,
    );

    return res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    return next(error);
  }
};

export const getAdminTicketMessages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const adminId = req.user?._id.toString() || "";

    const messages = await getAdminTicketHistory(
      req.params.ticketId as string,
      adminId,
    );

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    return next(error);
  }
};

export const closeTicket = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const adminId = req.user?._id.toString() || "";

    const ticket = await closeTicketService(req.params.ticketId as string, adminId);

    return res.status(200).json({
      success: true,
      message: "Ticket closed successfully",
      ticket,
    });
  } catch (error) {
    return next(error);
  }
};