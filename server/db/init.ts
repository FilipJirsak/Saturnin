import db from "./index.ts";

await db.query("REMOVE NAMESPACE IF EXISTS saturnin");

const sql = await Deno.readTextFile("./surql/init.surql");
const response = await db.query_raw(sql);
console.log(response);
