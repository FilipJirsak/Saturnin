import {type Patch, RecordId, ResponseError} from "@surrealdb/surrealdb";
import type {Issue, IssueFull} from "~/types";
import db from "../db/index.ts";

export const listProject = async (projectCode: string): Promise<IssueFull[]> => {
    return await multipleResult(
        () => db.query<[IssueDBFull[]]>("SELECT id, in.* AS issue FROM issue_code:[$project, none]..[$project];", {project: projectCode}),
    );
};

export const create = async (projectCode: string, issue: Issue): Promise<IssueFull> => {
    //TODO
    const issueDB = await db.create<IssueDB, IssueDB>("issue", toDB(issue));
    const lastCode = (await db.query<[{id: [string, number]} | undefined]>("SELECT id FROM ONLY issue_code:[$project, none]..[$project] ORDER BY id DESC LIMIT 1", {project: projectCode}))[0];
    const nextNumber = lastCode === undefined ? 1 : lastCode.id.id[1]+1;
    const issueCode: IssueCode = {
        id: new RecordId("issue_code", [projectCode, nextNumber]),
        in: issueDB[0].id,
        out: new RecordId("project", projectCode),
    }
    const issueCodeDB = await db.insert_relation<IssueCode>("issue_code", issueCode);
    return {code: `${projectCode}-${nextNumber}`, state: issueDB[0].state.id, last_modified: issueDB[0].last_modified, title: issueDB[0].title, summary: issueDB[0].summary, description: issueDB[0].description, data: issueDB[0].data};
};

//region Implementation
type IssueCode = {
    id: RecordId<"issue_code">;
    in: RecordId<"issue">;
    out: RecordId<"project">;
};

type IssueDB = Omit<Issue, "state"> & {
    state: RecordId<"issue_state">;
};

type IssueDBFull = {
    id: RecordId<"issue_code">;
    issue: IssueDBInternal;
};

type IssueDBInternal = {
    id: RecordId<"issue">;
    state: RecordId<"issue_state">;
    title: string, //TODO
    summary: string, //TODO
    description?: string,
    last_modified: string,
    data?: unknown
}

//TODO
type DBFuncMultiple = () => Promise<[IssueDBFull[]]>;

const multipleResult = async (func: DBFuncMultiple): Promise<IssueFull[]> => {
    const result = await func();
    return result[0].map(fromDB);
};

const fromDB = (entity: IssueDBFull): IssueFull => {
    const {id: _, state, ...issue} = entity.issue;
    return {
        code: (entity.id.id as Array<string | number>).join("-"),
        state: state.id as string,
        ...issue
    };
};

const toDB = (issue: Issue): IssueDB => {
    const { state, ...entity } = issue;
    return {
        state: new RecordId("issue_state", state ?? "new"), //TODO
        ...entity,
    };
};

//endregion
