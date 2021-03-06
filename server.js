//importing dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const {
  groupRegistrationRouter,
  requestRouter,
  userRoute,
  topicRouter,
  marksRouter,
  submissionRouter,
  notificationRouter,
  messageRouter,
} = require("./routes");
const stdFileUploadRouter = require("./routes/StdFileUploadRouter");
const messageSubscriber = require("./functions/messageSubscriber");
const adminDocumentUploadRouter = require("./routes/AdminDocUploadRouter");
const MessageModel = require("./models/MessageModal");
require("dotenv").config();

//creating express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:1234",
  },
});
app.use(express.json({ limit: "50mb" }));
app.use(cors());

//configuring dotenv variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

//router
app.use("/groups", groupRegistrationRouter);
app.use("/requests", requestRouter);
app.use("/user", userRoute);
app.use("/topics", topicRouter);
app.use("/marks", marksRouter);
app.use("/submissions", submissionRouter);
app.use("/notifications", notificationRouter);
app.use("/messages", messageRouter);
app.use("/fileUploadstd", stdFileUploadRouter);
app.use("/adminDocumentUploadRouter", adminDocumentUploadRouter);

//starting the web socket
const socket = io.on("connection", (socket) => {
  return socket;
});

//calling message subscriber
messageSubscriber(socket);
//creating express server

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is Running");
  });
}

server.listen(PORT, async () => {
  //mongoDB connection
  try {
    mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected!");
  } catch (error) {
    console.log(error);
  }
  console.log(`Express server running at PORT ${PORT}`);
});
