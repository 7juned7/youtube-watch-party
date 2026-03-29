// TEMP MOCK (jab tak backend ready nahi)

export const createRoom = async (username) => {
  return {
    roomId: Math.random().toString(36).substring(2, 8),
    role: "host",
  };
};

export const joinRoom = async (roomId, username) => {
  return {
    roomId,
    role: "participant",
  };
};