import { useAuth } from "../context/AuthContext";

export const usePermission = (permission) => {
  const { user } = useAuth();
  const permissions = user?.permissions || user?.user?.permissions || [];
  return permissions.includes(permission);
};
