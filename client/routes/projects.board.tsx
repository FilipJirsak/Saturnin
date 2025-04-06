import KanbanBoard from "~/features/views/kanban/KanbanBoard";
import {useProjects} from "~/hooks/useProjects";

export default function ProjectsBoardPage() {
  const projects = useProjects();

  //TODO: Přidat loading Spinner
  if (!projects || projects.length === 0) {
    return <div>Načítám projekty...</div>;
  }

  return (
      <div className="space-y-8">
        {projects.map((project) => (
            <div
                key={project.code}
                className="rounded-xl border bg-background"
            >
              <div className="border-b p-6">
                <h2 className="text-xl font-semibold">
                  {project.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground/80">
                  Kód projektu: {project.code}
                </p>
              </div>
              <div className="overflow-x-auto">
                <KanbanBoard projectCode={project.code} issues={project.issues} />
              </div>
            </div>
        ))}
      </div>
  );
}
