import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { requireAuth } from "~/utils/authGuard";

export const meta: MetaFunction = () => {
  return [
    { title: "Nastavení | Saturnin" },
    { name: "description", content: "Nastavení uživatelského účtu" },
  ];
};

export const loader = async (args: LoaderFunctionArgs) => {
  await requireAuth(args);
  return null;
};

export default function SettingsLayout() {
  return <Outlet />;
}
