import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  contactSubmissions,
  InsertContactSubmission,
  clubEloraSignups,
  InsertClubEloraSignup,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
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
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
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

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Inserts a new contact form submission.
 * Returns the inserted record's id.
 */
export async function insertContactSubmission(data: InsertContactSubmission): Promise<number | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot insert contact submission: database not available");
    return null;
  }
  const result = await db.insert(contactSubmissions).values(data);
  return (result[0] as { insertId: number }).insertId ?? null;
}

/**
 * Returns all contact submissions ordered by most recent first.
 */
export async function getContactSubmissions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactSubmissions).orderBy(contactSubmissions.createdAt);
}

/**
 * Inserts a new Club Elora signup.
 * Returns the inserted record's id, or signals if the email is already registered.
 */
export async function insertClubEloraSignup(data: InsertClubEloraSignup): Promise<{ id: number | null; alreadyExists: boolean }> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot insert Club Elora signup: database not available");
    return { id: null, alreadyExists: false };
  }
  // Check for duplicate email first
  const existing = await db.select().from(clubEloraSignups).where(eq(clubEloraSignups.email, data.email)).limit(1);
  if (existing.length > 0) {
    return { id: existing[0].id, alreadyExists: true };
  }
  const result = await db.insert(clubEloraSignups).values(data);
  return { id: (result[0] as { insertId: number }).insertId ?? null, alreadyExists: false };
}

/**
 * Returns all Club Elora signups ordered by most recent first.
 */
export async function getClubEloraSignups() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(clubEloraSignups).orderBy(clubEloraSignups.createdAt);
}
