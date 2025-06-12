import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import snakeRoutes from './routes/snakeRoutes.js';
import { config } from './config/index.js';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', snakeRoutes)

if (config.isInDevelopment) {
    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    }
    );
}


export default app;
export const prisma = new PrismaClient();