import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { SecuritySection } from "~/features/settings/SecuritySection";
import { requireAuth } from "~/utils/authGuard";

export const meta: MetaFunction = () => {
  return [
    { title: "Nastavení - Zabezpečení | Saturnin" },
    { name: "description", content: "Nastavení zabezpečení tvého účtu" },
  ];
};

export const loader = async (args: LoaderFunctionArgs) => {
  await requireAuth(args);
  return null;
};

export default function SecurityRoute() {
  return (
    <div className="space-y-6">
      <SecuritySection />
    </div>
  );
}
