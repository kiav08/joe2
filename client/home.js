const socket = io();

console.log("hello world");

input = document.getElementById("input");
messages = document.getElementById("messages");

let username = "anonymous";
if (localStorage.getItem("username" != null)) {
  username = localStorage.getItem("username");
}

function changeUsername() {
  username = document.getElementById("username").value;

  socket.emit("user joined", username);
}

function sendChat() {
  if (input.value) {
    socket.emit("chat message", username + ": " + input.value);
  }
  input.value = "";
}

socket.on("chat message", (msg) => {
  const item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
});
