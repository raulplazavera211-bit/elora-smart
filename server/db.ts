import { eq, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  contactSubmissions,
  InsertContactSubmission,
  clubEloraSignups,
  InsertClubEloraSignup,
  products,
  InsertProduct,
  orders,
  InsertOrder,
  orderItems,
  InsertOrderItem,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get user: database not available"); return undefined; }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function insertContactSubmission(data: InsertContactSubmission): Promise<number | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(contactSubmissions).values(data);
  return (result[0] as { insertId: number }).insertId ?? null;
}

export async function getContactSubmissions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
}

export async function insertClubEloraSignup(data: InsertClubEloraSignup): Promise<{ id: number | null; alreadyExists: boolean }> {
  const db = await getDb();
  if (!db) return { id: null, alreadyExists: false };
  const existing = await db.select().from(clubEloraSignups).where(eq(clubEloraSignups.email, data.email)).limit(1);
  if (existing.length > 0) return { id: existing[0].id, alreadyExists: true };
  const result = await db.insert(clubEloraSignups).values(data);
  return { id: (result[0] as { insertId: number }).insertId ?? null, alreadyExists: false };
}

export async function getClubEloraSignups() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(clubEloraSignups).orderBy(desc(clubEloraSignups.createdAt));
}

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

export async function getAllProducts(includeInactive = false) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(products).orderBy(products.sortOrder, products.id);
  return includeInactive ? rows : rows.filter(p => p.active);
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result[0] ?? undefined;
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result[0] ?? undefined;
}

export async function insertProduct(data: InsertProduct): Promise<number | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(products).values(data);
  return (result[0] as { insertId: number }).insertId ?? null;
}

export async function updateProduct(id: number, data: Partial<InsertProduct>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(products).set(data).where(eq(products.id, id));
}

export async function countProducts(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`count(*)` }).from(products);
  return Number(result[0]?.count ?? 0);
}

// ─── ORDERS ──────────────────────────────────────────────────────────────────

export async function createOrder(orderData: InsertOrder, items: InsertOrderItem[]): Promise<number | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(orders).values(orderData);
  const orderId = (result[0] as { insertId: number }).insertId;
  if (!orderId) return null;
  const itemsWithOrderId = items.map(item => ({ ...item, orderId }));
  await db.insert(orderItems).values(itemsWithOrderId);
  return orderId;
}

export async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getAllOrdersWithItems() {
  const db = await getDb();
  if (!db) return [];
  const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
  const allItems = await db.select().from(orderItems);
  return allOrders.map(order => ({
    ...order,
    items: allItems.filter(item => item.orderId === order.id),
  }));
}

export async function getOrderWithItems(orderId: number) {
  const db = await getDb();
  if (!db) return null;
  const orderResult = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!orderResult[0]) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  return { ...orderResult[0], items };
}

export async function updateOrderStatus(orderId: number, status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(orders).set({ status }).where(eq(orders.id, orderId));
}

export async function countOrders(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`count(*)` }).from(orders);
  return Number(result[0]?.count ?? 0);
}

export async function getTotalRevenue(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ total: sql<string>`COALESCE(SUM(total), 0)` })
    .from(orders)
    .where(sql`status != 'cancelled'`);
  return parseFloat(result[0]?.total ?? '0');
}

// ─── USERS (admin) ────────────────────────────────────────────────────────────

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(desc(users.createdAt));
}

export async function countUsers(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`count(*)` }).from(users);
  return Number(result[0]?.count ?? 0);
}
