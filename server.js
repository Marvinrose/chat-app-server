const app = require("./app");

const dotenv = require("dotenv");

const { Server } = require("socket.io");

const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

const path = require("path");

process.on("uncaughtException", (err) => {
  console.log(err);
  process.exit(1);
});

const http = require("http");
const FriendRequest = require("./models/friendRequest");
const User = require("./models/user");

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
    await User.findByIdAndUpdate(user_id, { socket_id, status: "Online" });
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

    // emit event => "new_friend_request"

    io.to(to_user.socket_id).emit("new_friend_request", {
      //
      message: "New Friend Request Received!!",
    });

    // emit event => "request_sent"

    io.to(from_user.socket_id).emit("request_sent", {
      //
      message: "Request Sent Successfully!!",
    });
  });

  socket.on("accept_request", async (data) => {
    console.log(data);

    const request_doc = await FriendRequest.findById(data.request_id);

    console.log(request_doc);

    // request_id

    const sender = await User.findById(request_doc.sender);
    const receiver = await User.findById(request_doc.recipient);

    sender.friends.push(request_doc.recipient);
    receiver.friends.push(request_doc.sender);

    await receiver.save({ new: true, validateModifiedOnly: true });
    await sender.save({ new: true, validateModifiedOnly: true });

    await FriendRequest.findByIdAndDelete(data.request_id);

    io.to(sender.socket_id).emit("request_accepted", {
      message: "Friend Request Accepted",
    });

    io.to(receiver.socket_id).emit("request_accepted", {
      message: "Friend Request Accepted",
    });
  });

  // handle text/link messages

  socket.on("text_message", (data) => {
    console.log("Received Message", data);

    // data: {to, from, text}

    // create a new conversation if it doesn't exist yet or add new message to the messages list

    // save to db

    // emit incoming_message => to user

    // emit outgoing_message => from user
  });

  // handle media/file messages

  socket.on("file_message", (data) => {
    console.log("Received Message", data);

    // data: {to, from, text, file}

    // get the file extension
    const fileExtension = path.extname(data.file.name);

    // generate a unique filename
    const fileName = `${Date.now()}_${Math.floor(
      Math.random() * 10000
    )}${fileExtension}`;

    // Upload file to AWS s3

    // create a new conversation if it doesn't exist yet or add new message to the messages list

    // save to db

    // emit incoming_message => to user

    // emit outgoing_message => from user
  });

  socket.on("end", async (data) => {
    // find user by _id and set the status to Offline
    if (data.user_id) {
      await User.findByIdAndUpdate(data.user_id, { status: "Offline" });
    }

    // TODO => Broadcast user_disconnected

    console.log("Closing Connection");
    socket.disconnect(0);
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
