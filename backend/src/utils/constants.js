export const USER_ROLES = {
    ADMIN: "admin",
    STAFF: "staff",
    USER: "user",
};
export const AvailableUserRoles = Object.values(USER_ROLES);


export const PERMISSIONS = {
  CREATE_SWEET: "create:sweet",
  UPDATE_SWEET: "update:sweet",
  DELETE_SWEET: "delete:sweet",
  VIEW_INVENTORY: "view:inventory",
  UPDATE_INVENTORY: "update:inventory",
};
export const AvailablePermissions = Object.values(PERMISSIONS);


export const ROLE_PERMISSIONS_MAP = {
    [USER_ROLES.ADMIN]: [
        ...AvailablePermissions
    ],
    [USER_ROLES.STAFF]: [
        PERMISSIONS.VIEW_INVENTORY,
        PERMISSIONS.UPDATE_INVENTORY,
        PERMISSIONS.UPDATE_SWEET,
        PERMISSIONS.CREATE_SWEET
    ],
    [USER_ROLES.USER]: [
        "view:ownProfile" 
    ],
};


export const TaskStatusEnum = {
    TODO: "todo",
    IN_PROGRESS: "in_progress",
    DONE: "done"
};
export const AvailableTaskStatuses = Object.values(TaskStatusEnum);