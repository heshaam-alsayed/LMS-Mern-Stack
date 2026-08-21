import { IUpdateUserInfo } from "@/types/auth.type";
import { apiClient } from "./apiClient";

export const updateMe = async (body: IUpdateUserInfo) => {
    const res = await apiClient("/users/update-me", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Error updating user info");
    }
    return data;
}
