import { seedDefaultPaymentMethods } from './server/db.ts';

try {
  await seedDefaultPaymentMethods();
  console.log('✓ Métodos de pago inicializados correctamente');
  process.exit(0);
} catch (e) {
  console.error('✗ Error:', e.message);
  process.exit(1);
}
