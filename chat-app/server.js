const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let users = {};

io.on("connection", (socket) => {

    socket.on("join", (username) => {
        users[socket.id] = username;

        io.emit("systemMessage", `${username} joined the chat`);

        io.emit("userList", Object.values(users));
    });

    socket.on("chatMessage", (message) => {

        io.emit("receiveMessage", {
            username: users[socket.id],
            message: message,
            time: new Date().toLocaleTimeString()
        });

    });

    socket.on("typing", () => {

        socket.broadcast.emit(
            "showTyping",
            users[socket.id] + " is typing..."
        );

    });

    socket.on("disconnect", () => {

        if(users[socket.id]){

            io.emit(
                "systemMessage",
                `${users[socket.id]} left the chat`
            );

            delete users[socket.id];

            io.emit(
                "userList",
                Object.values(users)
            );
        }
    });
});

server.listen(3000, () => {
    console.log("Server Running On Port 3000");
});
