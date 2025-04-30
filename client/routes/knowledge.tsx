import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { requireAuth } from "~/utils/authGuard";
import { KnowledgeLayout } from "~/features/knowledge/KnowledgeLayout";

export const meta: MetaFunction = () => {
  return [
    { title: "Znalosti | Saturnin" },
    { name: "description", content: "Tvá znalostní báze" },
  ];
};

export const loader = async (args: LoaderFunctionArgs) => {
  await requireAuth(args);
  return null;
};

export default function Knowledge() {
  return <KnowledgeLayout />;
}
