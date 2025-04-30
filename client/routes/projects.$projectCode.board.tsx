import { useOutletContext } from "@remix-run/react";
import { ProjectWithIssues, IssueFull } from "~/types";
import {KanbanBoard} from "~/features/views/kanban/KanbanBoard";
import { MetaFunction } from "@remix-run/node";

type ProjectContext = {
  project: ProjectWithIssues;
  issues: IssueFull[];
};

export const meta: MetaFunction = ({ params }) => {
  return [
    { title: `Kanban board - ${params.projectCode} | Saturnin` },
    { name: "description", content: "Kanban board pro vizualizaci a správu úkolů projektu" },
  ];
};

export default function ProjectBoardView() {
  const { project, issues } = useOutletContext<ProjectContext>();

  return (
      <div className="rounded-xl border bg-background">
        <div className="overflow-x-auto">
          <KanbanBoard projectCode={project.code} issues={issues} />
        </div>
      </div>
  );
}
