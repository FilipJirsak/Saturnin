import { useState } from "react";
import { IssueFull } from "~/types";
import { useProjects } from "~/hooks/useProjects";
import { useToast } from "~/hooks/use-toast";
import {InboxIssueForm} from "~/features/inbox/InboxIssueForm";
import {InboxIssueList} from "~/features/inbox/InboxIssueList";
import { MetaFunction } from "@remix-run/node";

//TODO (NL): Nahradit issues reálnými daty z API
const issues = [
  { code: 'TEST1-1', title: 'Issue 1', description: 'Popis issue 1', state: 'new', last_modified: "2025-03-15T10:30:00Z" },
  { code: 'TEST1-2', title: 'Issue 2', state: 'new', last_modified: "2025-03-26T18:30:00Z" },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Inbox | Saturnin" },
    { name: "description", content: "Správa příchozích úkolů a poznámek" },
  ];
};

export default function InboxPage() {
  const projects = useProjects();
  const { toast } = useToast();

  // TODO (NL): Implementovat možnost filtrování a řazení issues v inboxu
  // TODO (NL): Implementovat možnost hromadného přiřazování issues
  // TODO (NL): Implementovat možnost přidávání poznámek k issues před přiřazením
  // TODO (NL): Implementovat možnost označování issues jako spam nebo duplicitní

  const [mockIssues, setMockIssues] = useState<IssueFull[]>(issues);


  const handleIssueCreated = (newIssue: IssueFull) => {
    setMockIssues(prevIssues => [newIssue, ...prevIssues]);
  };

  const handleIssueAssigned = async (issueCode: string, projectCode: string) => {
    // TODO (NL): Nahradit reálným API voláním
    await new Promise(resolve => setTimeout(resolve, 1000));

    setMockIssues(prevIssues => prevIssues.filter(issue => issue.code !== issueCode));

    /*TODO (NL): Upravit variantu toastu?*/
    toast({
      title: "Issue přiřazeno",
      description: `Issue bylo úspěšně přiřazeno k projektu ${projectCode}`,
    });
  };

  const handleRefresh = async () => {
    // TODO (NL): Nahradit reálným API voláním
    await new Promise(resolve => setTimeout(resolve, 1000));

    /*TODO (NL): Upravit variantu toastu?*/
    toast({
      title: "Data aktualizována",
      description: "Seznam issues byl úspěšně aktualizován",
    });
  };

  return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <InboxIssueForm onIssueCreated={handleIssueCreated} />
          </div>

          <div className="lg:col-span-2">
            <InboxIssueList
                issues={mockIssues}
                projects={projects}
                onIssueAssigned={handleIssueAssigned}
                onRefresh={handleRefresh}
            />
          </div>
        </div>
      </div>
  );
}
