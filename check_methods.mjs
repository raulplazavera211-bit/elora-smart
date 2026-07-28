import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await createConnection(process.env.DATABASE_URL);
const [methods] = await conn.query("SELECT id, `key`, type, enabled FROM payment_methods ORDER BY position");
console.log(JSON.stringify(methods, null, 2));
await conn.end();
