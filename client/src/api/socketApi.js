import { socket } from "@/lib/socket";

// JOIN
export const joinRoom = (data) => {
  socket.emit("join_room", data);
};

// PLAYER
export const playVideo = (time) => {
  socket.emit("play", { time });
};

export const pauseVideo = (time) => {
  socket.emit("pause", { time });
};

export const seekVideo = (time) => {
  socket.emit("seek", { time });
};

export const changeVideo = (videoId) => {
  socket.emit("change_video", { videoId });
};

// ROLES
export const transferHost = (userId) => {
  socket.emit("transfer_host", { userId });
};

export const assignRole = (userId, role) => {
  socket.emit("assign_role", { userId, role });
};

export const removeUser = (userId) => {
  socket.emit("remove_user", { userId });
};