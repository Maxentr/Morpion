import fastify from "fastify"
import fastifyIO from "fastify-socket.io"
import ticTacToeRouter from "./src/tic-tac-toe/router"
import registerTicTacToeNamespace from "./src/tic-tac-toe/router"

const server = fastify()

server.register(fastifyIO)

server.ready((err) => {
  if (err) throw err

  server.io.on("connection", (socket) =>
    console.info("Socket connected!", socket.id),
  )

  ticTacToeRouter(server.io.of("/tic-tac-toe"))
})

server.listen({ port: 3001 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
