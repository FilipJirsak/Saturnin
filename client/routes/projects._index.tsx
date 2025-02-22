import {useProjects} from "~/hooks/useProjects";

export default function ProjectsPage() {
  const projects = useProjects() || [];

  return (
      <div>
        Přehled projektů:
        <ul className="list-disc pl-6">
          {projects.map((project) => (
              <li key={project.code}>
                <h2>{project.title}</h2>
              </li>
          ))}
        </ul>
      </div>
  );
}
