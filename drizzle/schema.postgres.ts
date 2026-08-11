import { boolean, integer, jsonb, numeric, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

const identity = () => integer("id").primaryKey().generatedByDefaultAsIdentity();
const createdAt = () => timestamp("createdAt").defaultNow().notNull();
const updatedAt = () => timestamp("updatedAt").defaultNow().notNull().$onUpdateFn(() => new Date());

export const userRole = pgEnum("user_role", ["user", "admin"]);
export const orderStatus = pgEnum("order_status", ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]);
export const paymentStatus = pgEnum("payment_status", ["unpaid", "pending_payment", "paid", "failed"]);
export const paymentMethodType = pgEnum("payment_method_type", ["redsys_card", "redsys_bizum", "transfer", "paypal", "cash_on_delivery", "sequra", "other"]);
export const couponType = pgEnum("coupon_type", ["percentage", "fixed"]);

/** Esquema PostgreSQL para Neon. Conserva los mismos nombres de tabla y columna que MySQL. */
export const users = pgTable("users", {
  id: identity(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRole("role").default("user").notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const contactSubmissions = pgTable("contact_submissions", {
  id: identity(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  telefono: varchar("telefono", { length: 64 }),
  email: varchar("email", { length: 320 }).notNull(),
  mensaje: text("mensaje"),
  idiomaCatalogo: varchar("idioma_catalogo", { length: 8 }),
  createdAt: createdAt(),
});
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;

export const clubEloraSignups = pgTable("club_elora_signups", {
  id: identity(),
  nombre: varchar("nombre", { length: 255 }),
  email: varchar("email", { length: 320 }).notNull().unique(),
  createdAt: createdAt(),
});
export type ClubEloraSignup = typeof clubEloraSignups.$inferSelect;
export type InsertClubEloraSignup = typeof clubEloraSignups.$inferInsert;

export const products = pgTable("products", {
  id: identity(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  tagline: varchar("tagline", { length: 512 }),
  description: text("description"),
  longDescription: text("longDescription"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  img: text("img"),
  gallery: jsonb("gallery").$type<string[]>(),
  badges: jsonb("badges").$type<string[]>(),
  features: jsonb("features").$type<string[]>(),
  highlights: jsonb("highlights").$type<{ label: string; value: string }[]>(),
  pitch: jsonb("pitch").$type<{ title: string; body: string }[]>(),
  technical: jsonb("technical").$type<{ group: string; specs: { label: string; value: string }[] }[]>(),
  dimensions: jsonb("dimensions").$type<{ label: string; value: string }[]>(),
  inTheBox: jsonb("inTheBox").$type<string[]>(),
  installation: jsonb("installation").$type<string[]>(),
  warranty: jsonb("warranty").$type<{ years: number; details: string }>(),
  faqs: jsonb("faqs").$type<{ q: string; a: string }[]>(),
  originalPrice: numeric("originalPrice", { precision: 10, scale: 2 }),
  stock: integer("stock").default(999).notNull(),
  active: boolean("active").default(true).notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export const orders = pgTable("orders", {
  id: identity(),
  userId: integer("userId"),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 64 }),
  address: text("address"),
  shippingAddress: text("shippingAddress"),
  shippingCity: varchar("shippingCity", { length: 255 }),
  shippingProvince: varchar("shippingProvince", { length: 128 }),
  shippingPostalCode: varchar("shippingPostalCode", { length: 10 }),
  paymentMethod: varchar("paymentMethod", { length: 32 }),
  notes: text("notes"),
  status: orderStatus("status").default("pending").notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  redsysOrderId: varchar("redsysOrderId", { length: 32 }),
  sequraOrderUrl: varchar("sequraOrderUrl", { length: 512 }),
  paymentStatus: paymentStatus("paymentStatus").default("unpaid").notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

export const orderItems = pgTable("order_items", {
  id: identity(),
  orderId: integer("orderId").notNull(),
  productId: integer("productId"),
  productName: varchar("productName", { length: 255 }).notNull(),
  productSlug: varchar("productSlug", { length: 128 }),
  productImg: text("productImg"),
  unitPrice: numeric("unitPrice", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").default(1).notNull(),
  createdAt: createdAt(),
});
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

export const paymentMethods = pgTable("payment_methods", {
  id: identity(),
  key: varchar("key", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: paymentMethodType("type").notNull(),
  enabled: boolean("enabled").default(false).notNull(),
  config: jsonb("config").$type<Record<string, string>>(),
  position: integer("position").default(0).notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = typeof paymentMethods.$inferInsert;

export const adminCredentials = pgTable("admin_credentials", {
  id: identity(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
export type AdminCredential = typeof adminCredentials.$inferSelect;
export type InsertAdminCredential = typeof adminCredentials.$inferInsert;

export const coupons = pgTable("coupons", {
  id: identity(),
  code: varchar("code", { length: 64 }).notNull().unique(),
  description: varchar("description", { length: 255 }),
  type: couponType("type").notNull(),
  value: numeric("value", { precision: 10, scale: 2 }).notNull(),
  minOrderAmount: numeric("minOrderAmount", { precision: 10, scale: 2 }),
  maxUses: integer("maxUses"),
  usedCount: integer("usedCount").default(0).notNull(),
  productSlug: varchar("productSlug", { length: 128 }),
  expiresAt: timestamp("expiresAt"),
  active: boolean("active").default(true).notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = typeof coupons.$inferInsert;

export const sitePopups = pgTable("site_popups", {
  id: identity(),
  name: varchar("name", { length: 255 }).notNull(),
  badge: varchar("badge", { length: 255 }),
  title: varchar("title", { length: 512 }).notNull(),
  titleHighlight: varchar("titleHighlight", { length: 255 }),
  subtitle: varchar("subtitle", { length: 255 }),
  body: text("body"),
  items: jsonb("items").$type<string[]>(),
  ctaLabel: varchar("ctaLabel", { length: 255 }).default("Ver la colección").notNull(),
  ctaUrl: varchar("ctaUrl", { length: 512 }).default("/coleccion").notNull(),
  dismissLabel: varchar("dismissLabel", { length: 255 }).default("No, gracias").notNull(),
  footerNote: varchar("footerNote", { length: 512 }),
  active: boolean("active").default(false).notNull(),
  delayMs: integer("delayMs").default(2000).notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
export type SitePopup = typeof sitePopups.$inferSelect;
export type InsertSitePopup = typeof sitePopups.$inferInsert;

export const experienceSlides = pgTable("experience_slides", {
  id: identity(),
  step: varchar("step", { length: 8 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl"),
  imageKey: text("imageKey"),
  sortOrder: integer("sortOrder").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
export type ExperienceSlide = typeof experienceSlides.$inferSelect;
export type InsertExperienceSlide = typeof experienceSlides.$inferInsert;
