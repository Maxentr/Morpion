import fastify from "fastify"
import fastifyIO from "fastify-socket.io"
import connectFourRouter from "./src/connect-four/router"
import ticTacToeRouter from "./src/tic-tac-toe/router"

const server = fastify()

server.register(fastifyIO)

server.ready((err) => {
  if (err) throw err

  server.io.on("connection", (socket) =>
    console.info("Socket connected!", socket.id),
  )

  ticTacToeRouter(server.io.of("/tic-tac-toe"))
  connectFourRouter(server.io.of("/connect-four"))
})

const host = process.env.API_IP_ADDRESS || "localhost"
const port = +(process.env.API_PORT || 3000)

server.listen({ host: host, port: port }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
