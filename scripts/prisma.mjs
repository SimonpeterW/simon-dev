// Runs the Prisma CLI with `.env.local` loaded and the datasource provider
// matched to DATABASE_URL: `file:` -> SQLite (local dev), `postgres://` -> PostgreSQL (Neon/Supabase).
// Usage: node scripts/prisma.mjs <prisma args...>
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

for (const file of [".env.local", ".env"]) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, "$2");
  }
}

process.env.DATABASE_URL ??= "file:./dev.db";
const provider = /^postgres(ql)?:\/\//.test(process.env.DATABASE_URL) ? "postgresql" : "sqlite";

const schemaPath = "prisma/schema.prisma";
const schema = readFileSync(schemaPath, "utf8");
const updated = schema.replace(/(datasource db \{[^}]*provider\s*=\s*)"[^"]+"/, `$1"${provider}"`);
if (updated !== schema) {
  writeFileSync(schemaPath, updated);
  console.log(`[prisma] datasource provider -> ${provider}`);
}

const args = process.argv.slice(2);
if (args.length === 0) process.exit(0);

// Schema changes should bypass Neon's connection pooler; use the direct URL when one is provided.
const env = { ...process.env };
if (args[0] === "db" && args[1] === "push" && process.env.DATABASE_URL_UNPOOLED) {
  env.DATABASE_URL = process.env.DATABASE_URL_UNPOOLED;
}

const result = spawnSync("npx", ["prisma", ...args], { stdio: "inherit", shell: true, env });
process.exit(result.status ?? 1);
