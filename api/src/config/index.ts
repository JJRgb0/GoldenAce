import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = path.resolve(__dirname, '../../../.env.local');
dotenv.config({ path: envPath });

export const config = {
    databaseUrl: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/mydb',
    isInDevelopment: process.env.VITE_DEVELOPMENT === 'true',
    apiKey: process.env.API_SECRET_KEY
}