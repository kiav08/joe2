const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const customerRoute = require("./routes/customer");
const storeRoutes = require("./routes/store");

const http = require("http").Server(app);
const io = require("socket.io")(http);

const chatLog = require("./db/chat.js");

// Middlewares

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client")));

// Send client files from server

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/pages/home.html"));
});

app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/pages/chat.html"));
});

app.get("/store", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/pages/store.html"));
});

// app.get("/chatlog", (req, res) => {
//   res.send(chatLog);
// });

// API

app.use("/customer", customerRoute);
app.use("/store", storeRoutes);

// Start server
const server = require("http").createServer();
const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Listening on ${port}`));

// app.listen(port, () => {
//   console.log(`Server open on port ${port}`);
// });

// Socket IO

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
    chatLog.push(msg);
  });
  socket.on("user joined", (username) => {
    console.log(username + " joined the chat");
    io.emit("chat message", username + " joined the chat");
  });
});

http.listen(port, "localhost", () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
