import {type Patch, RecordId, ResponseError} from "@surrealdb/surrealdb";
import type {Project, ProjectFull} from "~/types";
import db from "../db/index.ts";

export const list = async (): Promise<ProjectFull[]> => {
    return await multipleResult(
        () => db.select<ProjectDBFull>("project"),
    );
};

export const read = async (code: string): Promise<ProjectFull | null> => {
    return await singleResult(
        () => db.select<ProjectDBFull>(createID(code)),
    );
};

export const create = async (
    projectFull: ProjectFull,
): Promise<ProjectFull | null> => {
    const { code, ...project } = projectFull;
    try {
        return await singleResult(
            () => db.create<ProjectDBFull, ProjectDB>(createID(code), toDB(project)),
        );
    } catch (e) {
        //TODO
        if (
            e instanceof ResponseError &&
            e.message.match(/Database record `project:.+` already exists/)
        ) {
            console.error(e);
            return null;
        }
        throw e;
    }
};

export const update = async (code: string, project: Project): Promise<ProjectFull | null> => {
    return await singleResult(
        () => db.update<ProjectDBFull, ProjectDB>(createID(code), toDB(project)),
    );
};

export const merge = async (code: string, project: Partial<Project>): Promise<ProjectFull | null> => {
    //TODO Partial<>
    return await singleResult(
        () => db.merge<ProjectDBFull, ProjectDB>(createID(code), toDB(project)),
    );
};

export const patch = async (code: string, patch: Patch[]): Promise<ProjectFull | null> => {
    return await singleResult(
        () => db.patch<ProjectDBFull>(createID(code), patch),
    );
};

export const remove = async (code: string) => {
    await db.delete(createID(code));
};

//region Implementation
type ProjectDB = Omit<Project, "code" | "initial_issue_state"> & {
    initial_issue_state: RecordId;
};

type ProjectDBFull = Omit<ProjectFull, "code" | "initial_issue_state"> & {
    id: RecordId;
    initial_issue_state: RecordId;
};

//TODO
type DBFunc = () => Promise<ProjectDBFull | undefined>;
type DBFuncMultiple = () => Promise<ProjectDBFull[]>;

const createID = (code: string): RecordId => {
    return new RecordId("project", code);
}

const singleResult = async (func: DBFunc): Promise<ProjectFull | null> => {
    const result = await func();
    if (result === undefined) {
        return null;
    }
    return fromDB(result);
};

const multipleResult = async (func: DBFuncMultiple): Promise<ProjectFull[]> => {
    const result = await func();
    return result.map(fromDB);
};

const fromDB = (entity: ProjectDBFull): ProjectFull => {
    const { id, initial_issue_state, ...project } = entity;
    return {
        code: id.id as string,
        initial_issue_state: initial_issue_state.id as string,
        ...project,
    };
};

const toDB = (project: Project): ProjectDB => {
    const { initial_issue_state, ...entity } = project;
    return {
        initial_issue_state: new RecordId("issue_state", initial_issue_state),
        ...entity,
    };
};

//endregion
