export const userRolesEnum = {
    ADMIN: "admin",
    PROJECT_ADMIN: "project_admin",
    MEMBER: "member"
}

export const PERMISSIONS = {
  CREATE_SWEET: "create:sweet",
  UPDATE_SWEET: "update:sweet",
  DELETE_SWEET: "delete:sweet",
  VIEW_INVENTORY: "view:inventory",
  UPDATE_INVENTORY: "update:inventory",
};


export const AvailableUserRole = Object.values(userRolesEnum);
export const Availablepermissions = Object.values(PERMISSIONS);

export const TaskStatusEnum = {
    TODO: "todo",
    IN_PROGRESS: "in_progress",
    DONE: "done"
}

export const AvailableTaskStatuses = Object.values(TaskStatusEnum);