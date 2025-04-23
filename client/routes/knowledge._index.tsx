import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { requireAuth } from "~/utils/authGuard";

export const loader = async (args: LoaderFunctionArgs) => {
  await requireAuth(args);
  return redirect("/knowledge/library");
};
