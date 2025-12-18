import { api } from "./client";

export const getAllUsers = () => {
    return api.get("/admin/users");
}