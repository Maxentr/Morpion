# Games

A monorepo for games written in TypeScript. See [Available games](#available-games) for a list of games.

## Tech stack

- [pnpm](https://pnpm.io/) for package management.
- [Turborepo](https://turborepo.com/) for managing the monorepo.
- [TypeScript](https://www.typescriptlang.org/) for type safety.
- [Nextjs](https://nextjs.org/) for the frontend (web)
- [Fastify](https://www.fastify.io/) and [Socket.io](https://socket.io/) for the backend.
- There is currently **no database**, so the game state is stored in memory.

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

## Available games

| Game        | Status      |
| :---------- | :---------- |
| Tic Tac Toe | Playable    |
| Connect 4   | In progress |

## TODO

- [x] Abstract some classes
- [x] Add a parse function in classes to parse the data for the client
- [x] Refactor classes types
- [ ] Dynamic ServerEvents type
- [ ] Use ENV for WS_URL in client
- [ ] Use ENV in API
- [ ] Handle player disconnects
- [ ] Deploy to Vercel and Fly.io
- [ ] Create connect 4 game
