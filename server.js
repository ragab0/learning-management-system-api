const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./configs/database");
const ChatServer = require("socket.io").Server;

dotenv.config({ path: "./env" });
const { PORT = 3500, NODE_PLATFORM } = process.env;

/** connect to the db */
connectDatabase();

/**
 * configuring && running our app:
 *
 */

const appServer = app.listen(
  PORT,
  NODE_PLATFORM === "localhost" ? "localhost" : "",
  function () {
    console.log("Server is running on", PORT);
  }
);

/**
 * configuring && running our chat app on our express app - main server - as a partial app;
 *
 */

const io = new ChatServer(appServer, {
  cors: {
    origin: [
      "http://localhost:3000", // dev !!!!!!!!!!!!!
      "http://localhost:3001", // dev !!!!!!!!!!!!!
      "https://lms-depi-final-project.vercel.app",
    ],
    // methods: ["GET", "POST"],
    // credentials: true
  },
});

io.on("connection", function (socket) {
  console.log(`User ${socket.id} connected...`);
  socket.on("message", function (msg) {
    console.log("User msg is:", msg);
    io.emit("message", `${socket.id.substring(0, 5)}: ${msg}`);
  });
});
