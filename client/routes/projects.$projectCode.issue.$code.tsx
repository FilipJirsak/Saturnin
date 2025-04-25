import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { IssueDetail } from "~/features/issues/detail/IssueDetail";
import { IssueFull } from "~/types";
import { useState } from "react";

export async function loader({ params }: LoaderFunctionArgs) {
  const { projectCode, code } = params;

  try {
    const response = await fetch(`http://localhost:8080/api/project/${projectCode}/issue/${code}`);

    if (!response.ok) {
      throw new Response("Issue nenalezeno", { status: 404 });
    }

    const issue = await response.json();
    return issue;
  } catch (error) {
    console.error("Error loading issue:", error);
    throw new Response("Issue nenalezeno", { status: 404 });
  }
}

export default function IssueDetailsPage() {
  const initialIssue = useLoaderData<typeof loader>();
  const [currentIssue, setCurrentIssue] = useState<IssueFull>(initialIssue);

  //TODO (NL): Implementovat úpravu issues
  const handleSave = async (updatedIssue: IssueFull) => {
    setCurrentIssue(updatedIssue);
  };

  const handleDelete = async () => {
    // TODO (NL): Implementovat mazání issue
    console.log("Mazání...");
  };

  return (
    <div className="container mx-auto">
      <IssueDetail
        issue={currentIssue}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
