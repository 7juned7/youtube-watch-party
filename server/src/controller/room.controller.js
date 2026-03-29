const RoomModel = require("../model/room.model");
const { isHost, canControl } = require("../utils/roles");

const RoomController = {
  joinRoom(io, socket, { roomId, username }) {
    socket.join(roomId);

    const user = {
      id: socket.id,
      username,
      socketId: socket.id,
    };

    const room = RoomModel.createOrJoin(roomId, user);

    socket.emit("sync-state", room.videoState);
    io.to(roomId).emit("participants", room.users);
  },

  // ================= PLAY =================
  play(io, socket, { time } = {}) {
    const roomId = RoomModel.findRoomBySocket(socket.id);
    if (!roomId) return;

    const room = RoomModel.get(roomId);
    if (!room) return;

    if (!canControl(room, socket.id)) return;

    room.videoState.currentTime = time;
    room.videoState.isPlaying = true;
    room.videoState.lastUpdate = Date.now(); // 🔥 KEY

    io.to(roomId).emit("play", { time });
  },

  // ================= PAUSE =================
  pause(io, socket, { time } = {}) {
    const roomId = RoomModel.findRoomBySocket(socket.id);
    if (!roomId) return;

    const room = RoomModel.get(roomId);
    if (!room) return;

    if (!canControl(room, socket.id)) return;

    room.videoState.currentTime = time;
    room.videoState.isPlaying = false;
    room.videoState.lastUpdate = Date.now(); // 🔥 KEY

    io.to(roomId).emit("pause", { time });
  },

  // ================= SEEK =================
  seek(io, socket, { time } = {}) {
    const roomId = RoomModel.findRoomBySocket(socket.id);
    if (!roomId) return;

    const room = RoomModel.get(roomId);
    if (!room) return;

    if (!canControl(room, socket.id)) return;

    room.videoState.currentTime = time;
    room.videoState.lastUpdate = Date.now(); // 🔥 KEY

    io.to(roomId).emit("seek", { time });
  },

  // ================= CHANGE VIDEO =================
 changeVideo(io, socket, { videoId } = {}) {
  const roomId = RoomModel.findRoomBySocket(socket.id);
  if (!roomId) return;

  const room = RoomModel.get(roomId);
  
  if (!room) return;

  if (!canControl(room, socket.id)) return;

  room.videoState = {
    videoId,
    currentTime: 0,
    isPlaying: true, // autoplay better UX
    lastUpdate: Date.now(),
  };

  // 🔥 CORRECT EVENT
  console.log("🔥 CHANGE VIDEO CALLED", videoId);

io.to(roomId).emit("video_changed", room.videoState);

console.log("📡 EMITTED video_changed");
},

  // ================= ROLES =================
  transferHost(io, socket, { userId }) {
    const roomId = RoomModel.findRoomBySocket(socket.id);
    if (!roomId) return;

    const room = RoomModel.get(roomId);
    if (!room) return;

    const currentUser = room.users.find(
      (u) => u.socketId === socket.id
    );

    if (currentUser?.role !== "host") return;

    RoomModel.transferHost(roomId, userId);

    io.to(roomId).emit("participants", room.users);
  },

  assignRole(io, socket, { userId, role }) {
    const roomId = RoomModel.findRoomBySocket(socket.id);
    if (!roomId) return;

    const room = RoomModel.get(roomId);
    if (!room) return;

    if (!isHost(room, socket.id)) return;

    RoomModel.assignRole(roomId, userId, role);

    io.to(roomId).emit("participants", room.users);
  },

  removeUser(io, socket, { userId }) {
    const roomId = RoomModel.findRoomBySocket(socket.id);
    if (!roomId) return;

    const room = RoomModel.get(roomId);
    if (!room) return;

    const currentUser = room.users.find(
      (u) => u.socketId === socket.id
    );

    if (
      currentUser?.role !== "host" &&
      currentUser?.role !== "moderator"
    )
      return;

    const targetUser = room.users.find(
      (u) => u.socketId === userId
    );
    if (!targetUser || targetUser.role === "host") return;

    RoomModel.removeUser(roomId, userId);

    const targetSocket = io.sockets.sockets.get(userId);
    if (targetSocket) {
      targetSocket.emit("kicked");
      targetSocket.leave(roomId);
    }

    const updatedRoom = RoomModel.get(roomId);
    if (updatedRoom) {
      io.to(roomId).emit("participants", updatedRoom.users);
    }
  },
};

module.exports = RoomController;