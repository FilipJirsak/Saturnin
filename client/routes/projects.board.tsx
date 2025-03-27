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
                className="rounded-xl border border-surface-200 bg-white dark:border-surface-700 dark:bg-surface-800"
            >
              <div className="border-b border-surface-200 p-6 dark:border-surface-700">
                <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-50">
                  {project.title}
                </h2>
                <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
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
