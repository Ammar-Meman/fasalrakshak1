export const logEnterpriseAudit = (tenantId, action, details) => {
    console.log(`[Enterprise Audit] ${tenantId} | ${action} | ${JSON.stringify(details)}`);
};
