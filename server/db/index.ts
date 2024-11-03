import Surreal from "@surrealdb/surrealdb";

const index = new Surreal()
await index.connect("http://127.0.0.1:8000/rpc")
await index.use({
    namespace: "saturnin",
    database: "saturnin",
});

export default index
