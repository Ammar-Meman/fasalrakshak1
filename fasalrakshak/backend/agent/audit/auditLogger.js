/**
 * Placeholder for audit logger
 * Tracks every tool call and decision made by the agent for transparency.
 */

import AuditLog from '../../models/AuditLog.js';

export const logAgentAction = async (kisanId, conversationId, actionType, details) => {
  try {
    await AuditLog.create({
      kisanId,
      conversationId,
      actionType,
      details
    });
  } catch (error) {
    console.error("Audit log failed", error);
  }
};
