import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { NotificationsSection } from "~/features/settings/NotificationsSection";
import { requireAuth } from "~/utils/authGuard";

export const meta: MetaFunction = () => {
  return [
    { title: "Nastavení - Upozornění | Saturnin" },
    { name: "description", content: "Správa upozornění a notifikací" },
  ];
};

export const loader = async (args: LoaderFunctionArgs) => {
  await requireAuth(args);
  return null;
};

export default function NotificationsRoute() {
  return (
    <div className="space-y-6">
      <NotificationsSection />
    </div>
  );
}
