# %PROJECT_NAME%

This project is a demonstration application that showcases the main features of the [Galbe](https://galbe.dev) web framework.

## Requirements

[Galbe](https://galbe.dev) applications require [Bun](https://bun.sh) to be installed.

## Setup

To setup a new [Galbe](https://galbe.dev) app with.

Install dependencies:

```bash
bun install
```

Run the dev server:

```bash
bun dev
```

## Build

To bundle your Galbe app, simply run:

```bash
bun run build
```

This will bundle your app under `dist` directory by default.

See [documentation](https://galbe.dev/documentation) for more info and examples.

## Demo API usage

The demo app example implements an authentication systems with users and roles along with tasks that can be created and assigned to users.

The app automatically generates a `/doc` endpoint that redirects to the Swagger UI documentation page of the app.
This is allowed by the [Swagger plugin](https://galbe.dev/plugins).

> [!TIP]
> 📖 http://localhost:3000/doc.

### Authentication

Most endpoints require a JWT token to be provided in the `Authorization` header as Bearer token.

To authenticate, you need to create a user first. You can create a new user using the `POST /users` endpoint.

```bash
curl -H "Content-Type: application/json" -X POST -d '{"name": "pierre", "email": "pierre@example.com","password": "12345678"}' http://localhost:3000/users
```

Once done, you can obtain an authentication token by requesting `POST /login` endpoint, passing your user's `identifier` and `password`.

```bash
curl -H "Content-Type: application/json" -X POST -d '{"identifier": "pierre","password": "12345678"}' http://localhost:3000/login
```

You should now be able to access any endpoint that requires authentication. For example:

```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/users
```

> [!NOTE]
> Please note that the database state is not persisted across multiple application runs. Any resources created during a session will be lost when the server is shut down.

## Generate

### API spec

```bash
bun run spec
```

This will generate an OpenAPI 3.0 spec in `spec/api.yaml` by default.

See [documentation](https://galbe.dev/documentation) for more info and examples.

### Client

```bash
bun run client
```

This will generate a client typescript module bin in `dist/client.ts` by default.

See [documentation](https://galbe.dev/documentation) for more info and examples.

### Command Line Interface (CLI)

```bash
bun run cli
```

This will generate a CLI bin in `dist/cli` by default.

See [documentation](https://galbe.dev/documentation) for more info and examples.
