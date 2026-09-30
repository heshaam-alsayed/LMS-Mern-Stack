"use client";
import { getOperationUser } from "@/lib/api/getOperationUser";
import { useQuery } from "@tanstack/react-query";
import UserInfo from "./UserInfo";
import UserStatsOperation from "./UserStatsOperation";
import UserPurchasedCoursesOperation from "./UserPurchasedCoursesOperation";
import PurchaseHistory from "./PurchaseHistory";
import UserOperationSkeleton from "@/components/skeleton/UserOperationSkeleton";
import UserOperationError from "./UserOperationError";

type Props = {
  userId: string;
};
export default function UserOperation({ userId }: Props) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["get-operation-user", userId],
    queryFn: () => getOperationUser(userId),
  });
  console.log(data);
  if (isLoading) {
    return <UserOperationSkeleton />;
  }
  if (isError) {
    return <UserOperationError message={error.message} onRetry={refetch} />;
  }
  if (!data) return;
  return (
    <div className="space-y-4">
      <UserInfo user={data?.data.user} />
      <UserStatsOperation statistics={data.data.statistics} />
      <UserPurchasedCoursesOperation courses={data.data.courses} />
      <PurchaseHistory orders={data.data.orders} />
    </div>
  );
}
