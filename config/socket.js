const { Server, Socket } = require("socket.io");
const { get } = require("../app");

let io;

function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:5173",
        },
    });

    io.on("connection", (socket) => {
        console.log("terhubung:", socket.id);

        socket.on("disconnect", () => {
            console.log("terputus:", socket.id);
        });
    });

    return io;
}

function getIo() {
    if (!io) {
        throw new Error("Socket.io belum diinisialisasi");
    }

    return io;
}

module.exports = { initSocket, getIo };