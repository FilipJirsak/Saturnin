import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";

/**
 * Authentication guard for protected routes
 * Redirects to login page if user is not authenticated
 */
export async function requireAuth(args: LoaderFunctionArgs) {
  const { request } = args;
  // TODO (NL): Implementovat skutečnou kontrolu session

  const isAuthenticated = await checkAuthStatus(request);

  if (!isAuthenticated) {
    // TODO (NL): Implementovat skutečné přesměrování na přihlašovací stránku
    const url = new URL(request.url);
    return redirect(`/login?redirectTo=${encodeURIComponent(url.pathname)}`);
  }

  // TODO (NL): Nahradit skutečným uživatelským ID
  return { userId: "user-123" };
}

/**
 * Authentication guard for guest-only routes
 * Redirects to homepage if user is already authenticated
 */
export async function requireGuest(args: LoaderFunctionArgs) {
  const { request } = args;
  // TODO (NL): Implementovat skutečnou kontrolu session
  const isAuthenticated = await checkAuthStatus(request);

  if (isAuthenticated) {
    return redirect("/");
  }

  return null;
}

/**
 * Helper function to check authentication status
 * In a real implementation, this would access session data
 */
async function checkAuthStatus(request: Request): Promise<boolean> {
  // TODO (NL): Nahradit skutečnou verifikací session
  // TODO (NL): Nahradit skutečným procesem ověření
  const url = new URL(request.url);
  const simulateAuth = url.searchParams.get("simulateAuth");

  // TODO (NL): Implementovat kontrolu cookies

  return simulateAuth === "true";
}
