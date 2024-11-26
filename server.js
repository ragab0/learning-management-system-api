const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./configs/database");
const http = require("http");
const {
  protectSocket,
  handleNewMessageEvent,
} = require("./controllers/socketControllers");
const IoSocketServer = require("socket.io").Server;

/** setting up our env configs */
dotenv.config({ path: "./env" });
const { PORT = 3500, NODE_PLATFORM } = process.env;

/** connect to the db */
connectDatabase();

/** setting up the main server */
const server = http.createServer(app);

/** setting up the chat server upon the main server */
const io = new IoSocketServer(server, {
  cors: {
    origin: [
      "http://localhost:3000", // dev !!!!!!!!!!!!
      "http://localhost:3001", // dev !!!!!!!!!!!!
      "https://lms-depi-final-project.vercel.app",
    ],
    credentials: true,
  },
  cookie: true,
});

io.use(protectSocket);
io.on("connection", function (socket) {
  console.log(`SocketServer: the user ${socket.id} connected...`);

  socket.on("joinRoom", ({ roomId }) => {
    console.log("joined room:", roomId);
    socket.rooms.clear();
    socket.join(roomId);
  });
  socket.on("joinLopyOfRooms", ({ roomIds }) => {
    console.log("joined loopy:", roomIds);
    socket.rooms.clear();
    socket.join(roomIds);
  });
  socket.on("newMessage", (msgData) =>
    handleNewMessageEvent(socket, msgData, io)
  );
  socket.on("userStartTyping", ({ roomId }) => {
    socket.to(roomId).emit("userStartTyping");
  });
  socket.on("userStopedTyping", ({ roomId }) => {
    socket.to(roomId).emit("userStopedTyping");
  });
  socket.on("error", (error) => {
    console.error("Socket error:", error.message);
  });

  socket.on("disconnecting", () => {
    // Log rooms before the socket is fully disconnected
    console.log(`${socket.id} is leaving rooms:`, socket.rooms);
    socket.broadcast.emit("userStopedTyping");
  });
});

server.listen(PORT, () => {
  console.log("server is running and listening on:", PORT);
});
