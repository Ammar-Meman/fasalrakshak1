import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getAutonomousStatus, triggerFeedback, getModels } from '../controllers/autonomousController.js';

const router = express.Router();

router.get('/status', protect, getAutonomousStatus);
router.post('/feedback', protect, triggerFeedback);
router.get('/models', protect, getModels);

export default router;
