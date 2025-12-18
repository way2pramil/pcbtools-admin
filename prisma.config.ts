/**
 * Prisma Configuration (Prisma 7+)
 * 
 * Required for Prisma CLI (generate, migrate, db push).
 * @see https://pris.ly/d/config-datasource
 */

import path from "node:path";
import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";

// Load .env file
dotenv.config();

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  
  // Database URL for CLI operations (migrate, db push, etc)
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
