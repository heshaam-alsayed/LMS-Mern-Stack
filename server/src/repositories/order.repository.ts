import { ICreateOrder } from "../interfaces/orderInterface";
import OrderModel from "../models/order.model";

export const createOrder = async (orderData: ICreateOrder) => {
  return await OrderModel.create(orderData);
};

export const getOrders = async (transactions = false) => {
  const query = OrderModel.find()
    .populate("user" , "name email")
    .populate("course" , "name estimatePrice price thumbnail purchased")
    .sort({ createdAt: -1 });

  if (transactions) {
    query.limit(5);
  }

  return await query;
};

const orderRepository = { createOrder, getOrders };
export default orderRepository;
