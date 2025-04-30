import {useLoaderData} from "@remix-run/react";
import {LoaderFunctionArgs, MetaFunction} from "@remix-run/node";
import {IssueDetail} from "~/features/issues/detail/IssueDetail";
import {IssueFull} from "~/types";
import {useState} from "react";

export const meta: MetaFunction = ({ params }) => {
  return [
    { title: `Issue ${params.code} - ${params.projectCode} | Saturnin` },
    { name: "description", content: "Detailní informace o issue" },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { projectCode, code } = params;

  try {
    const response = await fetch(`http://localhost:8080/api/project/${projectCode}/issue/${code}`);

    if (!response.ok) {
      throw new Response("Issue nenalezeno", { status: 404 });
    }

    return await response.json();
  } catch (error) {
    console.error("Error loading issue:", error);
    throw new Response("Issue nenalezeno", { status: 404 });
  }
}

export default function IssueDetailsPage() {
  const initialIssue = useLoaderData<typeof loader>();
  const [currentIssue, setCurrentIssue] = useState<IssueFull>(initialIssue);

  // TODO (NL): Implementovat možnost sledování změn v issue
  // TODO (NL): Implementovat možnost přidávání odkazů na související issues
  // TODO (NL): Implementovat možnost přidávání checklistů
  // TODO (NL): Implementovat možnost přidávání odhadu času
  // TODO (NL): Implementovat možnost přidávání milníků

  //TODO (NL): Implementovat úpravu issues
  const handleSave = async (updatedIssue: IssueFull) => {
    setCurrentIssue(updatedIssue);
  };

  const handleDelete = async () => {
    // TODO (NL): Implementovat mazání issue
    // console.log("Mazání...");
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
