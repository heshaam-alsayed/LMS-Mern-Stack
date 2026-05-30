import cron from "node-cron";
import NotificationModel from "../models/notification.model";

cron.schedule("0 0 * * *", async () => {
  await NotificationModel.deleteMany({
    status: "read",
    createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
  });
});

