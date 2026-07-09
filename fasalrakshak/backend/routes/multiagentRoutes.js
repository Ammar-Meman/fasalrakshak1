import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getWorkforceStatus, getTasks, getReflections } from '../controllers/multiagentController.js';

const router = express.Router();

router.get('/workforce', protect, getWorkforceStatus);
router.get('/tasks', protect, getTasks);
router.get('/reflections', protect, getReflections);

export default router;
