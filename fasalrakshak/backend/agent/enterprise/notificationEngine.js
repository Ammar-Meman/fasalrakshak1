import Notification from '../../models/Notification.js';

export const sendEnterpriseNotification = async (tenantId, channel, recipient, message) => {
    try {
        const notif = new Notification({
            tenantId,
            channel,
            recipient,
            message,
            status: 'Sent'
        });
        await notif.save();
    } catch (e) {
        console.error("Failed to send notification", e);
    }
};
