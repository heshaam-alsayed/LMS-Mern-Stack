"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateStatusNotification } from "@/lib/api/updateStatusNotification";
import { INotificationsResponse } from "@/types/notification.type";

const QUERY_KEY = "admin-notifications";

export default function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateStatusNotification,
    onMutate: async (notificationId: string) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] });

      const previous = queryClient.getQueriesData<INotificationsResponse>({
        queryKey: [QUERY_KEY],
      });

      queryClient.setQueriesData<INotificationsResponse>(
        { queryKey: [QUERY_KEY] },
        (old) => {
          if (!old?.notifications) return old;

          return {
            ...old,
            notifications: old.notifications.map((notification) =>
              notification._id === notificationId
                ? { ...notification, status: "read" as const }
                : notification,
            ),
          };
        },
      );

      return { previous };
    },
    onError: (error, _variables, context) => {
      context?.previous.forEach(([key, value]) => {
        queryClient.setQueryData(key, value);
      });

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update notification",
      );
    },
    onSuccess: () => {
      toast.success("Notification marked as read");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  const isMarking = (notificationId: string) =>
    mutation.isPending && mutation.variables === notificationId;

  return { markAsRead: mutation.mutate, isMarking };
}
