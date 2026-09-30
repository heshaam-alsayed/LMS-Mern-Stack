"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { RecentActivityUser } from "@/types/organization.type";

export function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

type Props = {
  user: RecentActivityUser;
};

export default function RecentActivityUserAvatar({ user }: Props) {
  return (
    <Avatar className="h-9 w-9 shrink-0">
      {user.avatar?.url ? (
        <AvatarImage src={user.avatar.url} alt={user.name} />
      ) : null}

      <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
        {getInitials(user.name)}
      </AvatarFallback>
    </Avatar>
  );
}
