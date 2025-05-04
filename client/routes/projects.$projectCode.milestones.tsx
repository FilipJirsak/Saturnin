import { useOutletContext } from "@remix-run/react";
import { IssueFull, ProjectWithIssues } from "~/types";
import { MetaFunction } from "@remix-run/node";

type ProjectContext = {
  project: ProjectWithIssues;
  issues: IssueFull[];
};

export const meta: MetaFunction = ({ params }) => {
  return [
    { title: `Milníky - ${params.projectCode} | Saturnin` },
    { name: "description", content: "Přehled a správa milníků projektu" },
  ];
};

export default function ProjectMilestonesView() {
  const { project } = useOutletContext<ProjectContext>();

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-xl font-semibold mb-4">Milníky</h2>

      <div className="text-center p-8 text-muted-foreground">
        <p>Toto zobrazení je ve vývoji</p>
        <p className="text-sm mt-2">Brzy zde bude možné spravovat milníky projektu {project.title}</p>
      </div>
    </div>
  );
}
