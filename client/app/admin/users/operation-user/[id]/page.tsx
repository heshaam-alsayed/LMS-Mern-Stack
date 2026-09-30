import UserOperation from "@/components/admin/userOperation/UserOperation";
import React from "react";

type params = {
  id: string;
};
export default async function page({ params }: { params: Promise<params> }) {
    const {id} = await params
  return (
    <div>
      <UserOperation userId={id} />
    </div>
  );
}
