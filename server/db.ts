import Surreal from "@surrealdb/surrealdb";

const db = new Surreal()
await db.connect("http://127.0.0.1:8000/rpc")
await db.use({
    namespace: "saturnin",
    database: "saturnin",
});

export default db
