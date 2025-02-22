export type Code = {
    code: string;
};

export type TitleOrSummary = {
    title: string;
    summary?: string;
} | {
    title?: string;
    summary: string;
};

export type Project = {
    title: string;
    initial_issue_state: string;
};

export type ProjectFull = Project & Code;

export interface ProjectWithIssues extends ProjectFull {
    issues: IssueFull[];
}

export type Issue = TitleOrSummary & {
    description?: string;
    state?: string;
    data?: unknown;
};

export type IssueFull = Issue & {
    code: string;
    state: string;
    last_modified: string;
};

export type LoaderData = {
    projects: ProjectWithIssues[];
};

