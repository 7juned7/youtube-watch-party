function isHost(room, socketId) {
  return room.users.find(
    (u) => u.socketId === socketId && u.role === "host"
  );
}

function canControl(room, socketId) {
  return room.users.find(
    (u) =>
      u.socketId === socketId &&
      (u.role === "host" || u.role === "moderator")
  );
}

module.exports = { isHost, canControl };