import { useOutletContext } from "@remix-run/react";
import {IssueFull, ProjectWithIssues} from "~/types";

type ProjectContext = {
  project: ProjectWithIssues;
  issues: IssueFull[];
};

export default function ProjectMilestonesView() {
  const { project } = useOutletContext<ProjectContext>();

  return (
      <div className="rounded-xl border border-surface-200 bg-white p-6 dark:border-surface-700 dark:bg-surface-800">
        <h2 className="text-xl font-semibold mb-4">Milníky</h2>

        <div className="text-center p-8 text-surface-500 dark:text-surface-400">
          <p>Toto zobrazení je ve vývoji</p>
          <p className="text-sm mt-2">Brzy zde bude možné spravovat milníky projektu {project.title}</p>
        </div>
      </div>
  );
}
