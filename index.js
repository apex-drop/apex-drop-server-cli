const chalk = require("chalk");
const http = require("http");
const { Server } = require("socket.io");

const PORT = 7777;
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.join("receivers");

  socket.on("message", (arg) => {
    socket.to("receivers").emit("command", arg);
  });
});

server.listen(PORT, () => {
  console.log(
    `${chalk.green("Server is up and running on")} ${chalk.bold.yellow(
      `http://localhost:${PORT}`
    )}`
  );
});
