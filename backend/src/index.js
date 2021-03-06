const PORT = process.env.PORT || 8001;
const app = require("./application")(ENV, { updateChat });
const server = require("http").Server(app);
const WebSocket = require("ws");
const wss = new WebSocket.Server({ server });

wss.on("connection", (socket) => {
  socket.onmessage = (event) => {
    console.log(`Message Received: ${event.data}`);

    if (event.data === "ping") {
      socket.send(JSON.stringify("pong"));
    }
  };
});

function updateChat(id, message) {
  wss.clients.forEach(function eachClient(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "SET_MESSAGE",
          id,
          message,
        })
      );
    }
  });
}

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`);
});
