import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg"; // Corrected import
import { Pool } from "pg";

declare global {
  var prisma: PrismaClient | undefined;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set.");
}

// Optimized for Vercel + Supabase
const pool = new Pool({ 
  connectionString,
  max: 1, // Vercel Serverless: 1 connection per function instance
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});
const adapter = new PrismaPg(pool);

export const db = globalThis.prisma || new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "production" 
    ? ["error"]
    : ["query", "warn", "error"],
});

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;