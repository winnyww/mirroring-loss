// lily-express

const express = require("express");
const app = express();

app.use(express.static("public")); // allow access to the specified folder
// app.use(express.static(__dirname + '/node_modules'));
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});


// http server
const http = require("http"); // importing the lib

// if local
const hostname = "192.168.31.141";
const port = 3000;
const server = http.createServer(app); // attach the app to the server

// if local, provide port + ip address (hostname)
// server.listen(port, hostname, () => {}); (anonymous function)
server.listen(port, hostname, () => {
  console.log(`Server is running! Port: ${ port }`);
});


// socket.io
const socket = require("socket.io");
const io = socket(server);

io.on("connection", newConnection);
function newConnection(socket) {
  console.log(`New Connection - ID: ${socket.id}`);
  socket.on("connection_name", receive);
  function receive(data) {
    // console.log(data);
    socket.broadcast.emit("connection_name", data);
    // learn more about the emit() method:
    //https://socket.io/docs/v3/emit-cheatsheet/index.html
  }
}
