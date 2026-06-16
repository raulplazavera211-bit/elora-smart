import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Submissions from the contact form ("Solicitar catálogo privado").
 * Stores name, phone, email and message from potential customers.
 */
export const contactSubmissions = mysqlTable("contact_submissions", {
  id: int("id").autoincrement().primaryKey(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  telefono: varchar("telefono", { length: 64 }),
  email: varchar("email", { length: 320 }).notNull(),
  mensaje: text("mensaje"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;

/**
 * Signups for the Club Elora newsletter / membership.
 * Stores name and email of users who want exclusive access.
 */
export const clubEloraSignups = mysqlTable("club_elora_signups", {
  id: int("id").autoincrement().primaryKey(),
  nombre: varchar("nombre", { length: 255 }),
  email: varchar("email", { length: 320 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ClubEloraSignup = typeof clubEloraSignups.$inferSelect;
export type InsertClubEloraSignup = typeof clubEloraSignups.$inferInsert;

/**
 * Products catalog. Stores all product data including images, features, FAQs.
 * JSON columns store arrays/objects serialized as JSON strings.
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  tagline: varchar("tagline", { length: 512 }),
  description: text("description"),
  longDescription: text("longDescription"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  /** Main product image URL */
  img: text("img"),
  /** JSON array of gallery image URLs */
  gallery: json("gallery").$type<string[]>(),
  /** JSON array of badge strings e.g. ["Best seller", "Sin obra"] */
  badges: json("badges").$type<string[]>(),
  /** JSON array of feature strings */
  features: json("features").$type<string[]>(),
  /** JSON array of highlight objects {label, value} */
  highlights: json("highlights").$type<{label: string; value: string}[]>(),
  /** JSON array of pitch objects {title, body} */
  pitch: json("pitch").$type<{title: string; body: string}[]>(),
  /** JSON array of technical spec groups {group, specs: [{label, value}]} */
  technical: json("technical").$type<{group: string; specs: {label: string; value: string}[]}[]>(),
  /** JSON array of dimension entries {label, value} */
  dimensions: json("dimensions").$type<{label: string; value: string}[]>(),
  /** JSON array of in-the-box strings */
  inTheBox: json("inTheBox").$type<string[]>(),
  /** JSON array of installation steps */
  installation: json("installation").$type<string[]>(),
  /** Warranty info as JSON {years, details} */
  warranty: json("warranty").$type<{years: number; details: string}>(),
  /** JSON array of FAQ objects {q, a} */
  faqs: json("faqs").$type<{q: string; a: string}[]>(),
  stock: int("stock").default(999).notNull(),
  active: boolean("active").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Customer orders. Can be placed by guests (no userId) or logged-in users.
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  /** Reference to users table — null for guest orders */
  userId: int("userId"),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 64 }),
  /** Optional delivery address (full, legacy) */
  address: text("address"),
  /** Shipping address — street + number + floor */
  shippingAddress: text("shippingAddress"),
  /** Shipping city */
  shippingCity: varchar("shippingCity", { length: 255 }),
  /** Shipping province */
  shippingProvince: varchar("shippingProvince", { length: 128 }),
  /** Shipping postal code */
  shippingPostalCode: varchar("shippingPostalCode", { length: 10 }),
  /** Payment method chosen by customer */
  paymentMethod: varchar("paymentMethod", { length: 32 }),
  /** Optional notes from customer */
  notes: text("notes"),
  status: mysqlEnum("status", ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]).default("pending").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  /** Redsys order ID (12 chars) — null until payment is initiated */
  redsysOrderId: varchar("redsysOrderId", { length: 32 }),
  /** Payment status from Redsys */
  paymentStatus: mysqlEnum("paymentStatus", ["unpaid", "pending_payment", "paid", "failed"]).default("unpaid").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Individual line items within an order.
 * Snapshot of product name and price at time of purchase.
 */
export const orderItems = mysqlTable("order_items", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId"),
  /** Snapshot of product name at purchase time */
  productName: varchar("productName", { length: 255 }).notNull(),
  /** Snapshot of product slug at purchase time */
  productSlug: varchar("productSlug", { length: 128 }),
  /** Snapshot of product image at purchase time */
  productImg: text("productImg"),
  /** Unit price at purchase time */
  unitPrice: decimal("unitPrice", { precision: 10, scale: 2 }).notNull(),
  quantity: int("quantity").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Payment methods configuration.
 * Admins can enable/disable methods and configure credentials from the admin panel.
 */
export const paymentMethods = mysqlTable("payment_methods", {
  id: int("id").autoincrement().primaryKey(),
  /** Unique key identifier: redsys_card, redsys_bizum, transfer, paypal, cash_on_delivery */
  key: varchar("key", { length: 64 }).notNull().unique(),
  /** Display name shown to customers */
  name: varchar("name", { length: 255 }).notNull(),
  /** Short description shown to customers */
  description: text("description"),
  /** Method type for routing logic */
  type: mysqlEnum("type", ["redsys_card", "redsys_bizum", "transfer", "paypal", "cash_on_delivery", "other"]).notNull(),
  /** Whether this method is currently active */
  enabled: boolean("enabled").default(false).notNull(),
  /** JSON config (bank account, PayPal email, instructions, etc.) */
  config: json("config").$type<Record<string, string>>(),
  /** Display order */
  position: int("position").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = typeof paymentMethods.$inferInsert;
