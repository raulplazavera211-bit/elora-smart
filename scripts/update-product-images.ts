import { getDb } from '../server/db';
import { products } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const db = await getDb();

  // Check current product images
  const rows = await db.select().from(products);
  console.log('Current products:');
  rows.forEach((r: any) => console.log(`  ${r.id}: ${r.name} -> ${String(r.imageUrl || '').substring(0, 80)}`));

  // Update product images that use old /manus-storage/products/ paths
  const updates = [
    { oldPath: '/manus-storage/products/product-1-1782845394907_eec34997.png', newPath: '/manus-storage/product-1_351a7afa.png' },
    { oldPath: '/manus-storage/products/product-2-1782929331837_9e0dd92b.png', newPath: '/manus-storage/product-2_15edc27e.png' },
    { oldPath: '/manus-storage/products/product-3-1782923203819_82b92471.png', newPath: '/manus-storage/product-3_cc8ab943.png' },
  ];

  for (const update of updates) {
    await db.update(products)
      .set({ imageUrl: update.newPath })
      .where(eq(products.imageUrl, update.oldPath));
    console.log(`Updated: ...${update.oldPath.slice(-30)} -> ${update.newPath}`);
  }

  // Verify after update
  const allProducts = await db.select().from(products);
  console.log('\nAfter update:');
  allProducts.forEach((r: any) => console.log(`  ${r.id}: ${r.name} -> ${String(r.imageUrl || '').substring(0, 80)}`));
}

main().then(() => process.exit(0)).catch((e: any) => { console.error(e); process.exit(1); });
