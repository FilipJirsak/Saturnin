import {type MetaFunction} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import React, {type FunctionComponent} from "react";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {Card} from "~/components/ui/card";
import {Label} from "~/components/ui/label";
import {IssueFull, ProjectFull} from "~/types";

type ProjectWithIssues = ProjectFull & {
  issues: IssueFull[];
};

const Project: FunctionComponent<{
  title: string;
  code: string;
  issues: IssueFull[];
}> = ({ title, code, issues }) => {
  const submitForm = async (event: SubmitEvent) => {
    event.preventDefault();
    const resp = await fetch(`http://localhost:8080/api/project/${code}/issue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: event.currentTarget.title.value }),
    });
    if (resp.ok) {
      window.location.reload();
    } else {
      console.error(resp.status, resp.statusText, await resp.text());
    }
  };

  return (
      <div className="flex flex-col items-center gap-y-4 p-4">
        <header className="flex flex-col items-center gap-9">
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            {title}
          </h1>
        </header>
        <Card className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700 gap-y-4">
          <ul>
            {issues.map((issue) => (
                <li key={issue.code}>
                  <code>{issue.code}</code>: {issue.title}
                  {issue.summary}
                </li>
            ))}
          </ul>
          <form className="flex flex-col gap-y-2" onSubmit={submitForm}>
            <Label htmlFor="add-project">Název projektu</Label>
            <Input type="text" placeholder="Přidat projekt" name="add-project" />
            <Button type="submit">Přidat</Button>
          </form>
        </Card>
      </div>
  );
};

export const meta: MetaFunction = () => {
  return [
    { title: "Saturnin" },
    { name: "description", content: "Welcome to Saturnin!" },
  ];
};

export const loader = async (): Promise<ProjectWithIssues[]> => {
  const resp = await fetch("http://localhost:8080/api/project");
  const projects = await resp.json();
  for await (const project of projects) {
    const issueResp = await fetch(`http://localhost:8080/api/project/${project.code}/issue`);
    project.issues = await issueResp.json();
  }
  return projects;
};

export default function Index() {
  const projects: ProjectWithIssues[] = useLoaderData();

  return (
      <div className="flex h-screen items-start justify-center">
        {projects.map((project) => <Project key={project.code} title={project.title} code={project.code} issues={project.issues} />)}
      </div>
  );
}
