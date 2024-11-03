# Saturnin

## Development

### Before run

Install application dependencies:

* [Deno](https://deno.com)
* [SurrealDB](https://surrealdb.com/install)

Install library dependencies:

```shellscript
deno install
```

### Initialize database

It will remove all data from previous database!

Run:

```shellscript
deno task db:dev
deno task db:init
deno task db:sample
```

### Development run

Run the dev servers:

```shellscript
deno task db:dev
deno task server:dev
deno task client:dev
```
