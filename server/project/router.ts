import { type Context, Hono } from "@hono/hono";
import { HTTPException } from "@hono/hono/http-exception";
import { create, list, merge, patch, read, remove, update } from "./db.ts";
import { create as createIssue, get as getIssue, listProject as issueProjectList } from "../issue/db.ts";

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
    const result = await create(project);
    if (result === null) {
      return c.body(null, 409);
    }
    return c.json(result, 201);
  });

router
  .get("/:code{[A-Z][A-Z0-9_]*}", async (c) => {
    const result = await read(c.req.param("code"));
    return response(c, result);
  })
  .put(async (c) => {
    const result = await update(c.req.param("code"), await c.req.json());
    return response(c, result);
  })
  .patch(async (c) => {
    const action = c.req.header("Content-Type") === "application/json-patch+json" ? patch : merge;
    const result = action(c.req.param("code"), await c.req.json());
    return response(c, result);
  })
  .delete(async (c) => {
    const result = await read(c.req.param("code"));
    if (result === null) {
      return c.notFound();
    }
    await remove(c.req.param("code"));
    return c.json(result);
  });

router
  .get("/:code{[A-Z][A-Z0-9_]*}/issue", async (c) => {
    const result = await issueProjectList(c.req.param("code"));
    return response(c, result);
  })
  .post(async (c) => {
    const result = await createIssue(c.req.param("code"), await c.req.json());
    return response(c, result);
  })
  .get("/:code{[A-Z][A-Z0-9_]*}/issue/:issueCode", async (c) => {
    const result = await getIssue(c.req.param("code"), c.req.param("issueCode"));
    return response(c, result);
  });

export default router;

const response = <Type>(c: Context, response: Type): Response | Promise<Response> => {
  if (response === null) {
    return c.notFound();
  }
  return c.json(response);
};
