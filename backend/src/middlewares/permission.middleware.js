import { ROLE_PERMISSIONS } from "../utils/constants/roles.js";
import { ApiError } from "../utils/api-error.js";

export const checkPermission = (requiredPermission) => {
  return (req, _res, next) => {
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    const permissions = ROLE_PERMISSIONS[user.role] || [];

    if (!permissions.includes(requiredPermission)) {
      throw new ApiError(
        403,
        `Forbidden: Missing permission ${requiredPermission}`
      );
    }

    // Useful for auditing later
    req.usedPermission = requiredPermission;

    next();
  };
};
