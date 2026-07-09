import AgentExecution from '../models/AgentExecution.js';
import AgentTask from '../models/AgentTask.js';
import AgentReflection from '../models/AgentReflection.js';

export const getWorkforceStatus = async (req, res) => {
    try {
        const executions = await AgentExecution.find().sort({ createdAt: -1 }).limit(10);
        res.status(200).json({ success: true, data: executions });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await AgentTask.find({ executionId: req.query.executionId });
        res.status(200).json({ success: true, data: tasks });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
};

export const getReflections = async (req, res) => {
    try {
        const reflections = await AgentReflection.find().sort({ createdAt: -1 }).limit(5);
        res.status(200).json({ success: true, data: reflections });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
};
