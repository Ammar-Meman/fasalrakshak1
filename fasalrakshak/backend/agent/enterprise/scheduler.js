export const scheduleMacroJob = (jobName, payload, time) => {
    console.log(`[Scheduler] Job ${jobName} scheduled for ${time}`);
    // Integrates with cron/agenda in production
};
