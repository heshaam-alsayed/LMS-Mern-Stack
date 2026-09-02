import { IChartAnalyticsCourses } from "@/types/course.type";
import { IChartAnalyticsOrders } from "@/types/order.type";
import { IChartAnalyticsUsers } from "@/types/user.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UsersStatistics = {
  totalUsers: number;
  newUsers: number;
  usersWithCourses: number;
  deletedUsers: number;
};

type CoursesStatistics = {
  totalCourses: number;
  coursesCreated: number;
  totalPurchases: number;
  averageRating: number;
};

type OrdersStatistics = {
  totalOrders: number;
  newOrders: number;
  totalRevenue: number;
  yearlyRevenue: number;
};

type AnalyticsState = {
  year: string;

  users: {
    statistics: UsersStatistics | null;
    monthlyAnalytics: IChartAnalyticsUsers[];
  };

  courses: {
    statistics: CoursesStatistics | null;
    monthlyAnalytics: IChartAnalyticsCourses[];
  };

  orders: {
    statistics: OrdersStatistics | null;
    monthlyAnalytics: IChartAnalyticsOrders[];
  };
};

const initialState: AnalyticsState = {
  year: new Date().getFullYear().toString(),

  users: {
    statistics: null,
    monthlyAnalytics: [],
  },

  courses: {
    statistics: null,
    monthlyAnalytics: [],
  },

  orders: {
    statistics: null,
    monthlyAnalytics: [],
  },
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setAnalyticsYear: (state, action: PayloadAction<string>) => {
      state.year = action.payload;
    },
    setUsersStatistics: (state, action: PayloadAction<UsersStatistics>) => {
      state.users.statistics = action.payload;
    },
    setUsersMonthlyAnalytics: (
      state,
      action: PayloadAction<IChartAnalyticsUsers[]>,
    ) => {
      state.users.monthlyAnalytics = action.payload;
    },

    // courses

    setCoursesStatistics: (state, action: PayloadAction<CoursesStatistics>) => {
      state.courses.statistics = action.payload;
    },
    setCoursesMonthlyAnalytics: (
      state,
      action: PayloadAction<IChartAnalyticsCourses[]>,
    ) => {
      state.courses.monthlyAnalytics = action.payload;
    },

    // orders

    setOrdersStatistics: (state, action: PayloadAction<OrdersStatistics>) => {
      state.orders.statistics = action.payload;
    },
    setOrdersMonthlyAnalytics: (
      state,
      action: PayloadAction<IChartAnalyticsOrders[]>,
    ) => {
      state.orders.monthlyAnalytics = action.payload;
    },

    clearAnalytics: (state) => {
      state.users.statistics = null;
      state.users.monthlyAnalytics = [];

      state.courses.statistics = null;
      state.courses.monthlyAnalytics = [];

      state.orders.statistics = null;
      state.orders.monthlyAnalytics = [];
    },
  },
});

export const {
  setAnalyticsYear,

  setUsersStatistics,
  setUsersMonthlyAnalytics,

  setCoursesStatistics,
  setCoursesMonthlyAnalytics,

  setOrdersStatistics,
  setOrdersMonthlyAnalytics,

  clearAnalytics,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
