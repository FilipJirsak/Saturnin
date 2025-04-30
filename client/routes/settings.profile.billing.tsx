import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { BillingSection } from "~/features/settings/BillingSection";
import { requireAuth } from "~/utils/authGuard";

export const meta: MetaFunction = () => {
  return [
    { title: "Nastavení - Předplatné | Saturnin" },
    { name: "description", content: "Správa tvého předplatného a fakturace" },
  ];
};

export const loader = async (args: LoaderFunctionArgs) => {
  await requireAuth(args);
  return null;
};

export default function BillingRoute() {
  return (
      <div className="space-y-6">
        <BillingSection />
      </div>
  );
}
