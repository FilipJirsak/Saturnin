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

export interface IssueData {
  attachments?: Array<{ name: string; size: number; type?: string }>;
  link?: string;
}

export type Issue = TitleOrSummary & {
  description?: string;
  state?: string;
  data?: IssueData;
  tags?: string[];
  due_date?: string;
  comments_count?: number;
  attachments_count?: number;
  created_at?: string;
  last_modified: string;
  assignee?: string;
};

export type IssueFull = Issue & {
  code: string;
  state: string;
};

/*export type Issue = TitleOrSummary & {
    description?: string;
    state?: string;
    data?: unknown;
};

export type IssueFull = Issue & {
    code: string;
    state: string;
    last_modified: string;
};*/

export type LoaderData = {
  projects: ProjectWithIssues[];
};

/*Calendar*/

export type IssueState = "new" | "to_do" | "in_progress" | "done";

export type CalendarViewType = "month" | "week" | "day";

/*Settings + auth*/

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "user";
};
