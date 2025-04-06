import { useState } from "react";
import { IssueFull } from "~/types";
import { useProjects } from "~/hooks/useProjects";
import { useToast } from "~/hooks/use-toast";
import {InboxIssueForm} from "~/features/inbox/InboxIssueForm";
import {InboxIssueList} from "~/features/inbox/InboxIssueList";

//TODO (NL): Nahradit issues reálnými daty z API
const issues = [
  { code: 'TEST1-1', title: 'Testovací issue 1', description: 'Popis issue 1', state: 'new', last_modified: "2025-03-15T10:30:00Z" },
  { code: 'TEST1-2', title: 'Testovací issue 2', state: 'new', last_modified: "2025-03-26T18:30:00Z" },
];

export default function InboxPage() {
  const projects = useProjects();
  const { toast } = useToast();

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
