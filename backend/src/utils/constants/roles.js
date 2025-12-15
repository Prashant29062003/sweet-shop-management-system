import { PERMISSIONS, AvailablePermissions } from "./permissions.js";

export const USER_ROLES = {
    ADMIN: "admin",
    STAFF: "staff",
    USER: "customer",
};
export const AvailableUserRoles = Object.values(USER_ROLES);

export const ROLE_PERMISSIONS = {
    [USER_ROLES.ADMIN]: [
        // Grant all available permissions to the Admin role
        ...AvailablePermissions
    ],
    [USER_ROLES.STAFF]: [
        PERMISSIONS.VIEW_INVENTORY,
        PERMISSIONS.UPDATE_INVENTORY,
    ],
    [USER_ROLES.USER]: [
        // No special permissions for regular users
    ],
};



