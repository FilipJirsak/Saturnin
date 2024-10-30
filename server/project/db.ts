import {type Patch, RecordId, ResponseError} from "@surrealdb/surrealdb";
import db from "../db.ts";

type Code = {
    code: string;
};

export type Project = {
    name: string;
};

export type ProjectFull = Project & Code;

const toDB = (project: ProjectFull): { code: string; entity: Project } => {
    const { code, ...entity } = project;
    return { code, entity };
};

const fromDB: {
    (entity: Project & { id: RecordId }): ProjectFull;
    (entity: Project & { id: RecordId } | undefined): ProjectFull | null;
} = (
    entity: Project & { id: RecordId } | undefined,
): ProjectFull | null => {
    if (entity === undefined) {
        return null;
    }
    const { id, ...project } = entity;
    return { code: id.id as string, ...project };
};

export const list = async (): Promise<Project[]> => {
    return (await db.select<Project>("project")).map((entity) =>
        fromDB(entity)
    );
};

export const read = async (code: string): Promise<Project | null> => {
    return fromDB(await db.select<Project>(new RecordId("project", code)));
};

export const create = async (
    project: ProjectFull,
): Promise<ProjectFull | null> => {
    const { code, entity } = toDB(project);
    try {
        const response = await db.create<Project>(
            new RecordId("project", code),
            entity,
        );
        return fromDB(response);
    } catch (e) {
        if (e instanceof ResponseError) {
            return null;
        }
        throw e;
    }
};

export const update = async (
    code: string,
    project: Project,
): Promise<ProjectFull | null> => {
    return fromDB(
        await db.update<Project>(new RecordId("project", code), project),
    );
};

export const merge = async (
    code: string,
    project: Partial<Project>,
): Promise<ProjectFull | null> => {
    return fromDB(
        await db.merge<Project>(new RecordId("project", code), project),
    );
};

export const patch = async (
    code: string,
    patch: Patch[],
): Promise<ProjectFull | null> => {
    return fromDB(
        await db.patch<Project>(new RecordId("project", code), patch),
    );
};

export const remove = async (code: string) => {
    await db.delete(new RecordId("project", code));
};
