"use client";
import { getMe } from "@/lib/api/getMe";
import { logoutUser, setUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useQuery } from "@tanstack/react-query";
import  { ReactNode, useEffect } from "react";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { data, isError } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isError) {
      dispatch(logoutUser());
    }
  }, [isError, dispatch]);

  useEffect(() => {
    if (data) {
      dispatch(setUser(data.user));
    }
  }, [data, dispatch]);
  return children;
}
