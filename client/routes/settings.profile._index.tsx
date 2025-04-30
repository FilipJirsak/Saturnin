import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { requireAuth } from "~/utils/authGuard";
import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Nastavení - Profil | Saturnin" },
    { name: "description", content: "Správa profilu a nastavení účtu" },
  ];
};

export const loader = async (args: LoaderFunctionArgs) => {
  await requireAuth(args);
  return redirect("/settings/profile/general");
};
