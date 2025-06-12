import express from 'express';
import { getSnakeLeaderboard, saveSnakeScore } from '../controllers/snakeControllers.js';

const router = express.Router();

router.get('/snake-leaderboard', getSnakeLeaderboard);
router.post('/snake-leaderboard', saveSnakeScore);

export default router;