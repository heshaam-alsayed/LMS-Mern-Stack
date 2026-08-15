import { ICreateOrder } from "../interfaces/orderInterface";
import OrderModel from "../models/order.model";

export const createOrder = async (orderData: ICreateOrder) => {
  return await OrderModel.create(orderData);
};

export const getOrders = async () => {
  return await OrderModel.find().sort({ createdAt: -1 }).populate("user");
};

const orderRepository = { createOrder, getOrders };
export default orderRepository;
