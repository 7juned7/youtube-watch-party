import { socket } from "../lib/socket";

export const assignRole = (userId, role) => {
  socket.emit("assign_role", { userId, role });
};

export const removeUser = (userId) => {
  socket.emit("remove_user", { userId });
};

export const transferHost = (userId) => {
  socket.emit("transfer_host", { userId });
};