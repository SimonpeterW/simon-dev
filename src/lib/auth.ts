import bcrypt from "bcryptjs";
import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import { redirect } from "next/navigation";
import { z } from "zod";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Email & password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(raw, req) {
      const ip = clientIp(new Headers(req?.headers as Record<string, string> | undefined));
      if (!rateLimit(`login:${ip}`, { limit: 5, windowMs: 15 * 60_000 }).success) return null;

      const parsed = credentialsSchema.safeParse(raw);
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminHash = process.env.ADMIN_PASSWORD_HASH;
      if (!parsed.success || !adminEmail || !adminHash) return null;

      const emailMatches = parsed.data.email.toLowerCase() === adminEmail.toLowerCase();
      // Always run bcrypt so timing doesn't reveal whether the email matched.
      const passwordMatches = await bcrypt.compare(parsed.data.password, adminHash);
      if (!emailMatches || !passwordMatches) return null;

      return { id: "admin", name: "SimonPeter", email: adminEmail };
    },
  }),
];

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/admin/login", error: "/admin/login" },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "github") return true;
      const allowed = process.env.ADMIN_GITHUB_USERNAME?.toLowerCase();
      const login = (profile as { login?: string } | undefined)?.login?.toLowerCase();
      return Boolean(allowed && login === allowed);
    },
    async jwt({ token }) {
      // Only the admin can ever obtain a session (see authorize / signIn above).
      token.role = "admin";
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.role = token.role;
      return session;
    },
  },
};

export const getSession = () => getServerSession(authOptions);

/** Use at the top of every admin page and server action. */
export async function requireAdmin() {
  const session = await getSession();
  if (session?.user?.role !== "admin") redirect("/admin/login");
  return session;
}

export const githubAuthEnabled = () => Boolean(process.env.GITHUB_ID && process.env.GITHUB_SECRET);
