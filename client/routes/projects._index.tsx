import { Link } from "@remix-run/react";
import { useProjects } from "~/hooks/useProjects";

export default function ProjectsPage() {
  const projects = useProjects() || [];

  return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-4">Přehled projektů</h1>

        {projects.length === 0 ? (
            <p className="text-surface-500 dark:text-surface-400">Žádné projekty nebyly nalezeny</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                  <Link
                      key={project.code}
                      to={`/projects/${project.code}`}
                      className="rounded-xl border border-surface-200 bg-white p-6 transition-all hover:shadow-md dark:border-surface-700 dark:bg-surface-800"
                  >
                    <h2 className="text-xl font-semibold">{project.title}</h2>
                    <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
                      Kód projektu: {project.code}
                    </p>
                    <div className="mt-4 flex justify-between text-sm">
                      <span>Počet issues: {project.issues.length}</span>
                      <span className="text-primary dark:text-primary/80">Zobrazit detail →</span>
                    </div>
                  </Link>
              ))}
            </div>
        )}
      </div>
  );
}
