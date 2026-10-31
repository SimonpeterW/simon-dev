import { withAuth } from "next-auth/middleware";

// Guards every /admin page except the login screen. Server actions and pages
// also call requireAdmin(), so this is the first line of defence, not the only one.
export default withAuth({
  pages: { signIn: "/admin/login" },
  callbacks: { authorized: ({ token }) => token?.role === "admin" },
});

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};
