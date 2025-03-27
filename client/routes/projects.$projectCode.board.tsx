import { useOutletContext } from "@remix-run/react";
import { ProjectWithIssues, IssueFull } from "~/types";
import KanbanBoard from "~/features/views/kanban/KanbanBoard";

type ProjectContext = {
  project: ProjectWithIssues;
  issues: IssueFull[];
};

export default function ProjectBoardView() {
  const { project, issues } = useOutletContext<ProjectContext>();

  return (
      <div className="rounded-xl border border-surface-200 bg-white dark:border-surface-700 dark:bg-surface-800">
        <div className="overflow-x-auto">
          <KanbanBoard projectCode={project.code} issues={issues} />
        </div>
      </div>
  );
}
