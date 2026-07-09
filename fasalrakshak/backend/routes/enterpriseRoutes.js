import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getDashboard, getHeatmap, getKPIs } from '../controllers/enterpriseController.js';

const router = express.Router();

router.get('/dashboard', protect, getDashboard);
router.get('/heatmap', protect, getHeatmap);
router.get('/kpi', protect, getKPIs);
// Other enterprise endpoints would be wired similarly

export default router;
