import { useState } from 'react';
import {IssueFull} from "~/types";
import KanbanColumn from "./KanbanColumn";

interface BoardProps {
  projectCode: string;
  issues: IssueFull[];
}

const COLUMNS = [
  { state: 'new', title: 'Nové' },
  { state: 'to_do', title: 'K řešení' },
  { state: 'in_progress', title: 'V řešení' },
  { state: 'done', title: 'Hotovo' },
];

const KanbanBoard = ({ projectCode, issues: initialIssues }: BoardProps) => {
  const [issues, setIssues] = useState(initialIssues);

  //TODO: Nutno implementovat
  const handleMoveCard = async (cardCode: string, targetState: string) => {
    console.log(`Moving card ${cardCode} to ${targetState}`);
  };

  return (
      <div className="flex space-x-4 overflow-x-auto p-4">
        {COLUMNS.map((column) => (
            <KanbanColumn
                key={column.state}
                title={column.title}
                state={column.state}
                issues={issues.filter((issue) => issue.state === column.state)}
                onMoveCard={handleMoveCard}
                projectCode={projectCode}
            />
        ))}
      </div>
  );
};

export default KanbanBoard;
