import AuditLog from '../../models/AuditLog.js';

/**
 * Audit Trail Logger
 * Logs decisions made by the CascadeFlow engine.
 */
export const logAudit = async (kisanId, conversationId, actionType, details) => {
  try {
    // Only log in production or if explicitly enabled, to save DB space,
    // but per prompt requirements we must "Log every decision" and "Store inside AuditLog".
    const logEntry = new AuditLog({
      kisanId,
      conversationId,
      actionType,
      details
    });
    await logEntry.save();
    return logEntry;
  } catch (error) {
    console.error('[AUDIT ERROR] Failed to save audit log:', error);
    // Don't crash the main flow if audit logging fails
  }
};
