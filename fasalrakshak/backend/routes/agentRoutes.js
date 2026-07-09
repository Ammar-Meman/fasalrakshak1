import express from 'express';
import multer from 'multer';
import os from 'os';
import { protect } from '../middleware/authMiddleware.js';
import { handleAgentChat } from '../controllers/agentController.js';
import { handleDiseaseTool } from '../controllers/diseaseController.js';
import { handleSymptomTool } from '../controllers/symptomController.js';
import { handleVoiceTool } from '../controllers/voiceController.js';
import { handleForecastTool } from '../controllers/forecastController.js';
import { handleRecommendation } from '../controllers/recommendationController.js';

const router = express.Router();

// Multer config for temporary uploads
const upload = multer({ dest: os.tmpdir() });

// Route for agent orchestration and chat
router.post('/chat', protect, handleAgentChat);

// Route for disease tool (accepts multipart image upload)
router.post('/tools/disease', protect, upload.single('image'), handleDiseaseTool);

// Route for symptom tool (accepts JSON with text)
router.post('/tools/symptom', protect, handleSymptomTool);

// Route for voice tool (accepts multipart audio upload)
router.post('/tools/voice', protect, upload.single('audio'), handleVoiceTool);

// Route for disease forecast tool (accepts JSON with crop and location)
router.post('/tools/forecast', protect, handleForecastTool);

// Route for enterprise recommendation engine
router.post('/recommend', protect, handleRecommendation);

export default router;
