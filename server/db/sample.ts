import db from "./index.ts";

const sql = await Deno.readTextFile("./surql/sample.surql");
const response = await db.query_raw(sql);
console.log(response);
