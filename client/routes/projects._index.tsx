import { Link } from "@remix-run/react";
import { useProjects } from "~/hooks/useProjects";

export default function ProjectsPage() {
  const projects = useProjects() || [];

  return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-4">Přehled projektů</h1>

        {projects.length === 0 ? (
            <p className="text-muted-foreground">Žádné projekty nebyly nalezeny</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                  <Link
                      key={project.code}
                      to={`/projects/${project.code}`}
                      className="rounded-xl border bg-background p-6 transition-all hover:shadow-md"
                  >
                    <h2 className="text-xl font-semibold">{project.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Kód projektu: {project.code}
                    </p>
                    <div className="mt-4 flex justify-between text-sm">
                      <span>Počet issues: {project.issues.length}</span>
                      <span className="text-primary">Zobrazit detail →</span>
                    </div>
                  </Link>
              ))}
            </div>
        )}
      </div>
  );
}
