import { IUpdatePassword } from "@/types/auth.type";
import { apiClient } from "./apiClient";

export const updatePassword = async (body: IUpdatePassword) => {
    const response = await apiClient("/users/update-password", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to update password");
    }
    return data;
}
