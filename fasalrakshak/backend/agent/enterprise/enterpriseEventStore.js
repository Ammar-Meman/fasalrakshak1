import EnterpriseEvent from '../../models/EnterpriseEvent.js';

export const logEnterpriseEvent = async (tenantId, eventType, location, details) => {
    try {
        const evt = new EnterpriseEvent({
            tenantId,
            eventType,
            location,
            details
        });
        await evt.save();
    } catch (e) {
        console.error("Event Store failed", e);
    }
};
