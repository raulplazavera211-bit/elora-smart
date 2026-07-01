import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { parse as parseCookies } from "cookie";
import { jwtVerify } from "jose";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
  isEloraAdmin: boolean;
};

async function verifyEloraAdminCookie(req: CreateExpressContextOptions["req"]): Promise<boolean> {
  try {
    const cookies = parseCookies(req.headers.cookie || "");
    const token = cookies["elora_admin_session"];
    if (!token) return false;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "elora-admin-secret");
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;
  let isEloraAdmin = false;

  // First check the Elora admin cookie (custom login system)
  isEloraAdmin = await verifyEloraAdminCookie(opts.req);

  if (!isEloraAdmin) {
    // Fall back to Manus OAuth session
    try {
      user = await sdk.authenticateRequest(opts.req);
    } catch (error) {
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
    isEloraAdmin,
  };
}
