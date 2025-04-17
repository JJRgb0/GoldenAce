import express from 'express';
import homeController from '../controllers/homeController.js';

const router = express.Router();

// Rota para a página principal
router.get('/', homeController.getHomePage);

export default router;