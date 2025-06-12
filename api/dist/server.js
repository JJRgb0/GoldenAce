import express from 'express';
import cors from 'cors';
import { PrismaClient } from '../generated/prisma/edge.js';
import snakeRoutes from './routes/snakeRoutes.js';
const app = express();
app.use(express.json());
app.use(cors());
const PORT = 3000;
app.use('/api', snakeRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to the Snake Game API');
});
app.listen(PORT, () => {
    console.log('Server is running on http://localhost:3000');
});
export default app;
export const prisma = new PrismaClient();
//# sourceMappingURL=server.js.map