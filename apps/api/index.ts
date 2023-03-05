import fastify from "fastify"
import fastifyIO from "fastify-socket.io"
import registerTicTacToeNamespace from "./src/tic-tac-toe/router"

const server = fastify()

server.register(fastifyIO)

server.ready((err) => {
  if (err) throw err

  server.io.on("connection", (socket) =>
    console.info("Socket connected!", socket.id),
  )

  server.io.of("tic-tac-toe").on("connection", (socket) => {
    console.info("Socket connected in tic tac toe !", socket.id)
    registerTicTacToeNamespace(socket)
  })
})

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
