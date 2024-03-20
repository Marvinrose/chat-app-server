const app = require("./app");

const dotenv = require("dotenv");

const { Server } = require("socket.io");

const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

process.on("uncaughtException", (err) => {
  console.log(err);
  process.exit(1);
});

const http = require("http");
const FriendRequest = require("./models/friendRequest");

const server = http.createServer(app);

// Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const DB = process.env.DBURI.replace("<PASSWORD>", process.env.DBPASSWORD);

mongoose
  .connect(DB, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useFndOneAndUpdate: true,
    // useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("DB connection is succesful!..");
  })
  .catch((err) => {
    console.log(err);
  });

// Listen for when the client connects via socket.io-client
io.on("connection", async (socket) => {
  console.log(socket, "socket:");
  console.log(JSON.stringify(socket.handshake.query));
  const user_id = socket.handshake.query["user_id"];

  const socket_id = socket.id;

  console.log(`User connected ${socket_id}`);

  if (Boolean(user_id)) {
    await User.findByIdAndUpdate(user_id, { socket_id });
  }

  // We can write our event socket listeners here...

  socket.on("friend_request", async (data) => {
    console.log(data.to);

    // data => {to, from}

    const to_user = await User.findById(data.to).select("socket_id");

    const from_user = await User.findById(data.from).select("socket_id");

    // create a friend request

    await FriendRequest.create({
      sender: data.from,
      recipient: data.to,
    });

    // TODO => create a friend request

    io.to(to.socket_id).emit("new_friend_request", {
      //
    });
  });
});

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
