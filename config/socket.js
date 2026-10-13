const { Server, Socket } = require("socket.io");
const { get } = require("../app");
const { verifyToken } = require("../utils/jwt");

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

    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if(!token) {
            return next(new Error("Token Tidak Ada"));
        }

        try {
            const payload = verifyToken(token);
            if (!payload) {
                return next(new Error("Token Tidak Valid"));
            }
            socket.user = payload;
            next();
        } catch (err) {
            next(new Error("Token sudah tidak valid"));
        }
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