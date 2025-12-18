/**
 * Prisma Configuration (Prisma 7+)
 * 
 * Required for Prisma CLI (generate, migrate, etc).
 * @see https://pris.ly/d/config-datasource
 */

import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
});
