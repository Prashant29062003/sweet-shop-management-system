import { usePermission } from "../../hooks/usePermission";

export default function PermissionGate({ permission, children }) {
  const allowed = usePermission(permission);
  if (!allowed) return null;
  return children;
}
