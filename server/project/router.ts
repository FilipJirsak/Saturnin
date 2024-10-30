import {Hono} from "@hono/hono";
import {HTTPException} from '@hono/hono/http-exception'
import {create, list, merge, patch, type Project, read, remove, update} from "./db.ts";

const router = new Hono();

router
    .get("/", async (c) => c.json(await list()))
    .post(async (c) => {
        const project = await c.req.json();
        if (!(/^[A-Z][A-Z0-9_]*$/.test(project.code))) {
            throw new HTTPException(400, {
                message: "Project code must match /[A-Z][A-Z0-9_]*]/.",
            });
        }
        const response = await create(project);
        if (response === null) {
            return c.body(null, 409);
        }
        return c.json(response, 201);
    });

router
    .get("/:code{[A-Z][A-Z0-9_]*}", async (c) => {
        const response = await read(c.req.param("code"));
        if (response === null) {
            return c.notFound();
        }
        return c.json(response);
    })
    .put(async (c) => {
        const response = await update(c.req.param("code"), await c.req.json());
        if (response === null) {
            return c.notFound();
        }
        return c.json(response);
    })
    .patch(async (c) => {
        let response: Project | null;
        if (c.req.header("Content-Type") === "application/json-patch+json") {
            response = await patch(c.req.param("code"), await c.req.json());
        } else {
            response = await merge(c.req.param("code"), await c.req.json());
        }
        if (response === null) {
            return c.notFound();
        }
        return c.json(response);
    })
    .delete(async (c) => {
        const response = await read(c.req.param("code"));
        if (response === null) {
            return c.notFound();
        }
        await remove(c.req.param("code"));
        return c.json(response);
    });

router
    .get("/:code{[A-Z][A-Z0-9_]*}/issue", async (c) => {
        const response = await read(c.req.param("code"));
        if (response === null) {
            return c.notFound();
        }
        return c.json(response);
    })
    .post(async (c) => {
        const response = await update(c.req.param("code"), await c.req.json());
        if (response === null) {
            return c.notFound();
        }
        return c.json(response);
    });

export default router;
