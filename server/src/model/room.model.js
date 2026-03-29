const rooms = {};

const RoomModel = {
  createOrJoin(roomId, user) {
    if (!rooms[roomId]) {
      rooms[roomId] = {
        users: [],
        videoState: {
          videoId: "dQw4w9WgXcQ",
          currentTime: 0,
          isPlaying: false,
          lastUpdate: Date.now(), // 🔥 IMPORTANT
        },
      };
    }

    const room = rooms[roomId];

    const existingUser = room.users.find(
      (u) => u.socketId === user.socketId
    );

    if (existingUser) return room;

    user.role = room.users.length === 0 ? "host" : "participant";

    room.users.push(user);

    return room;
  },

  get(roomId) {
    return rooms[roomId];
  },

  getAllRooms() {
    return rooms;
  },

  findRoomBySocket(socketId) {
    for (const roomId in rooms) {
      const room = rooms[roomId];
      const found = room.users.find((u) => u.socketId === socketId);
      if (found) return roomId;
    }
    return null;
  },

  transferHost(roomId, newHostId) {
    const room = rooms[roomId];
    if (!room) return;

    room.users.forEach((u) => {
      u.role = u.socketId === newHostId ? "host" : "participant";
    });
  },

  assignRole(roomId, userId, role) {
    const room = rooms[roomId];
    if (!room) return;

    const user = room.users.find((u) => u.socketId === userId);
    if (!user) return;

    if (user.role === "host") return;

    user.role = role;
  },

  removeUser(roomId, socketId) {
    const room = rooms[roomId];
    if (!room) return;

    const leavingUser = room.users.find(
      (u) => u.socketId === socketId
    );

    if (!leavingUser) return;

    room.users = room.users.filter(
      (u) => u.socketId !== socketId
    );

    if (leavingUser.role === "host" && room.users.length > 0) {
      room.users[0].role = "host";
    }

    if (room.users.length === 0) {
      delete rooms[roomId];
    }
  },
};

module.exports = RoomModel;