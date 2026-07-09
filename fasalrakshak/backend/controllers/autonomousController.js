import ModelVersion from '../models/ModelVersion.js';
import TrainingRun from '../models/TrainingRun.js';
import Feedback from '../models/Feedback.js';

export const getAutonomousStatus = async (req, res) => {
    try {
        const activeModels = await ModelVersion.find({ status: 'Active' });
        const runningJobs = await TrainingRun.find({ status: 'Running' });
        res.status(200).json({ success: true, activeModels, runningJobs });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
};

export const triggerFeedback = async (req, res) => {
    try {
        const { recommendationId, status, farmerRating } = req.body;
        // Mock feedback ingestion
        const feedback = await Feedback.findOneAndUpdate(
            { recommendationId },
            { status, farmerRating, timestamp: new Date() },
            { new: true, upsert: true }
        );
        res.status(200).json({ success: true, data: feedback });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
};

export const getModels = async (req, res) => {
    try {
        const models = await ModelVersion.find().sort({ trainingDate: -1 }).limit(20);
        res.status(200).json({ success: true, data: models });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
};
