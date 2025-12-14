import { AuditLog } from "../models/auditLog.model.js";

export const logAudit = async ({
  user,
  action,
  resourceType,
  resourceId,
  permissionUsed,
  metadata = {}
}) => {
  await AuditLog.create({
    user,
    action,
    resourceType,
    resourceId,
    permissionUsed,
    metadata
  });
};
