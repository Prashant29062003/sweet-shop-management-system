import { api } from "./client";

export const getAllUsers = () => {
    return api.get("/admin/users");
}

export const approveStaff = (userId) => {
    return api.patch(`/admin/users/${userId}/verify`, {});
}