const { Server } = require("socket.io");
const RoomController = require("../controller/room.controller.js");
const RoomModel = require("../model/room.model.js");

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: (origin, cb) => cb(null, true), // 🔥 allow all + domain
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket"], // 🔥 important for production
  });

 

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // ================= JOIN =================
    socket.on("join_room", (data) => {
      RoomController.joinRoom(io, socket, data);

      setTimeout(() => {
        const room = RoomModel.get(data.roomId);
        if (!room) return;

        let currentTime = room.videoState.currentTime;
        let isPlaying = room.videoState.isPlaying;

        // 🔥 LIVE TIME CALCULATION
        if (isPlaying && room.videoState.lastUpdate) {
          const diff =
            (Date.now() - room.videoState.lastUpdate) / 1000;

          currentTime += diff;
        }

        console.log("🧠 FINAL SYNC:", {
          currentTime,
          isPlaying,
        });

        socket.emit("sync-state", {
          ...room.videoState,
          currentTime,
          isPlaying,
        });
      }, 100);
    });

    // ================= PLAYER EVENTS =================
    socket.on("play", (data) => {
      RoomController.play(io, socket, data);
    });

    socket.on("pause", (data) => {
      RoomController.pause(io, socket, data);
    });

    socket.on("seek", (data) => {
      RoomController.seek(io, socket, data);
    });

    socket.on("change_video", (data) => {
      
      RoomController.changeVideo(io, socket, data);
    });

    // ================= ROLES =================
    socket.on("transfer_host", (data) => {
      RoomController.transferHost(io, socket, data);
    });

    socket.on("assign_role", (data) => {
      RoomController.assignRole(io, socket, data);
    });

    socket.on("remove_user", (data) => {
      RoomController.removeUser(io, socket, data);
    });

    // ================= DISCONNECT =================
    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);

      const rooms = RoomModel.getAllRooms();

      for (const roomId in rooms) {
        const room = rooms[roomId];

        const wasHost = room.users.find(
          (u) => u.socketId === socket.id && u.role === "host"
        );

        RoomModel.removeUser(roomId, socket.id);

        const updatedRoom = RoomModel.get(roomId);

        if (updatedRoom) {
          if (wasHost && updatedRoom.users.length > 0) {
            updatedRoom.users[0].role = "host";
            console.log("👑 New host:", updatedRoom.users[0].socketId);
          }

          io.to(roomId).emit("participants", updatedRoom.users);
        }
      }
    });
  });

  return io;
}

module.exports = { initSocket };