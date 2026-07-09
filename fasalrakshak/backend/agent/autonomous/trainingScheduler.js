import LearningCycle from '../../models/LearningCycle.js';

export const scheduleTraining = async (type = 'incremental') => {
    console.log(`[Training Scheduler] Scheduling ${type} training run...`);
    const cycle = new LearningCycle({
        cycleId: `LC_${Date.now()}`,
        status: 'Scheduled',
        triggerSource: 'System Threshold Reached'
    });
    await cycle.save();
    
    // In production, this would trigger the Python ML pipeline via child_process or API
    return cycle;
};
