export interface IOrdersStatisticsResponse {
  success: boolean;
  data: {
    totalOrders: number;
    newOrders: number;
    totalRevenue: number;
    yearlyRevenue: number;
    uniqueCustomers: number;
  };
}

export interface IChartAnalyticsOrders {
  count: number;
  month: string;
}

export interface IRevenueOrdersMonthly {
  month: string;
  orders: number;
  revenue: number;
}
export interface IRevenueOrdersResponse {
  success: boolean;
  data: {
    yearlyRevenue: number;
    allTimeRevenue: number;
    monthly: IRevenueOrdersMonthly[];
  };
}

export type IGrowthItem = {
  current: number;
  previous: number;
  percentage: number;
  trend: "up" | "down" | "same";
};

export type IGrowthResponse = {
  success: boolean;
  data: {
    users: IGrowthItem;
    courses: IGrowthItem;
    orders: IGrowthItem;
  };
};

export type User = {
  _id: string;
  name: string;
  email: string;
  avatar: {
    url: string;
  };
};

export type Course = {
  _id: string;
  name: string;
  estimatePrice: number;
  price: number;
  category: {
    _id: string;
    name: string;
  };
  thumbnail?: {
    url: string;
  };
  purchased: number;
};

export type Order = {
  _id: string;
  user: User;
  course: Course;
  price: number;
  createdAt: string;
};

export type ResponseOrdersInvoices = {
  success: boolean;
  result: number;
  orders: Order[];
  pagination: {
    currentPage: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};
