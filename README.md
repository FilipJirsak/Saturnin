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

## Project structure
```text
data   – SurrealDB database files. Is created within first SurrealDB start.
public – Static files for client (frontend).
client – Client (frontend) code – Remix.
server – Server (backend) code – Hono.
types  – Common TypeScript types for both server and client.
surql  – SurrealDB initialization scripts and sample data.
test   – Tests
http   – Testing HTTP requests for IntelliJ Idea HTTP client.
```

## Documentation

For detailed technical documentation, please see [DOCUMENTATION.md](DOCUMENTATION.md).
