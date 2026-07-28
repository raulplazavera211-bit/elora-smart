import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await createConnection(process.env.DATABASE_URL);
await conn.query(
  "INSERT INTO payment_methods (`key`, name, description, type, enabled, config, position) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE enabled = 1, position = 5",
  ['sequra', 'seQura - Paga en 3 cuotas', 'Divide tu compra en 3 pagos mensuales sin interes. Solo necesitas tu DNI y movil.', 'sequra', 1, '{}', 5]
);
console.log('seQura insertado/actualizado correctamente');
const [methods] = await conn.query("SELECT id, `key`, type, enabled FROM payment_methods ORDER BY position");
console.log(JSON.stringify(methods, null, 2));
await conn.end();
