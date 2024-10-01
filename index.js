const chalk = require("chalk");
const http = require("http");
const { Server } = require("socket.io");
const { networkInterfaces } = require("os");

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

server
  .listen(PORT, () => {
    const nets = networkInterfaces();

    console.log(chalk.bold.green("Sync Server is up and running \n"));

    for (const interfaces of Object.values(nets)) {
      for (const net of interfaces) {
        const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;

        if (net.family === familyV4Value) {
          /** Show Address */
          console.log(
            `${chalk.blue("[ADDR]")} ${chalk.bold.yellow(
              `${net.address}:${PORT}`
            )}`
          );
        }
      }
    }
  })
  .on("error", () => {
    console.log(chalk.bold.red("Failed to Start Sync Server"));

    console.log(
      chalk.yellow(
        "Please ensure the server isn't running already. You should restart your computer if the problem persists. \n"
      )
    );
  });
