import dotenv from 'dotenv';
import path from 'path';
const envPath = path.resolve(__dirname, '..', '..', '..', '.env.local');
dotenv.config({ path: envPath });
export const config = {
    databaseUrl: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/mydb',
};
//# sourceMappingURL=index.js.map