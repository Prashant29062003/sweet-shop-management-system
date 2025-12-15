export const PERMISSIONS = {
    // Sweet Management
    CREATE_SWEET: "create:sweet",
    UPDATE_SWEET: "update:sweet",
    DELETE_SWEET: "delete:sweet",

    // Inventory Management
    VIEW_INVENTORY: "view:inventory",
    UPDATE_INVENTORY: "update:inventory",
    MANAGE_USERS: "manage:users",
};
export const AvailablePermissions = Object.values(PERMISSIONS);



export const TaskStatusEnum = {
    TODO: "todo",
    IN_PROGRESS: "in_progress",
    DONE: "done"
};
export const AvailableTaskStatuses = Object.values(TaskStatusEnum);