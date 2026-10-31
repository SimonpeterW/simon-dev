// Prints a bcrypt hash for ADMIN_PASSWORD_HASH.
// Usage: npm run hash-password -- "your-strong-password"
import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password || password.length < 10) {
  console.error('Usage: npm run hash-password -- "a-password-of-at-least-10-chars"');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);

// Next.js expands $VARS inside .env files, which would corrupt a bcrypt hash,
// so every $ must be escaped there. Hosting dashboards (Vercel) take the raw hash.
console.log("\nFor .env.local:");
console.log(`ADMIN_PASSWORD_HASH="${hash.replaceAll("$", "\\$")}"`);
console.log("\nFor the Vercel dashboard (paste as-is):");
console.log(`${hash}\n`);
