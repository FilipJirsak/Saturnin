import {type MetaFunction} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import React, {type FunctionComponent} from "react";
import {IssueFull, ProjectFull} from "../../types/index.ts";

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
        <div className="flex flex-col items-center p-4">
            <header className="flex flex-col items-center gap-9">
                <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {title}
                </h1>
            </header>
            <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700">
                <ul>
                    {issues.map((issue) => (
                        <li key={issue.code}>
                            <code>{issue.code}</code>: {issue.title}
                            {issue.summary}
                        </li>
                    ))}
                </ul>
                <form onSubmit={submitForm}>
                    <label>
                        Název: <input name="title" />
                    </label>
                    <button type="submit">Přidat</button>
                </form>
            </div>
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
