import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { requireAuth } from "~/utils/authGuard";

export const meta: MetaFunction = () => {
  return [
    { title: "Nastavení | Saturnin" },
    { name: "description", content: "Správa nastavení účtu" },
  ];
};

export const loader = async (args: LoaderFunctionArgs) => {
  await requireAuth(args);
  return redirect("/settings/profile/general");
};
