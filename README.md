# Tic Tac Toe

This is a simple Tic Tac Toe game written in TypeScript. React for the front and Fastify for the backend. Communication between the two is done via WebSockets using (Socket.io)[https://socket.io/]. There is currently no database, so the game state is stored in memory.

## How to run

This project uses Turborepo to manage the monorepo. You can find more information about it here: https://turborepo.com/

### Install dependencies

```bash
pnpm install
```

### Start a package

```bash
pnpm dev --filter PACKAGE_NAME
```

## TODO

- Change how replay works
- store Player in the user context
