import {Hono} from "@hono/hono";
import {cors} from "@hono/hono/cors";
import {showRoutes} from "@hono/hono/dev";
import projectRouter from "./project/router.ts";
import issueRouter from "./issue/index.ts";
import viewRouter from "./view/index.ts";
import knowledgeRouter from "./knowledge/router.ts";

const app = new Hono();
const api = new Hono();

api.use(cors());
api.route("/project", projectRouter);
api.route("/issue", issueRouter);
api.route("/view", viewRouter);
api.route("/knowledge", knowledgeRouter);

app.route("/api", api);

showRoutes(app, {
    verbose: true,
});

export default app;
