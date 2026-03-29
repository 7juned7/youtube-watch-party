"use client";

import {
  transferHost,
  assignRole,
  removeUser,
} from "@/api/socketApi";

export default function Participants({ users, currentUser }) {
  const isHost = currentUser?.role === "host";
  const isModerator = currentUser?.role === "moderator";

  const canManage = isHost || isModerator;

  const handleRemoveHost = (targetUserId) => {
    // find new host (first available non-host user)
    const newHost = users.find(
      (u) => u.socketId !== targetUserId
    );

    if (!newHost) return alert("No users to transfer host!");

    transferHost(newHost.socketId);

    setTimeout(() => {
      removeUser(targetUserId);
    }, 300); // slight delay to ensure transfer
  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-2xl mt-4 border border-white/10 backdrop-blur-lg">
      <h2 className="font-semibold mb-4 text-lg">👥 Participants</h2>

      {users.map((user) => {
        const isSelf = user.socketId === currentUser?.socketId;

        return (
          <div
            key={user.socketId}
            className="flex justify-between items-center bg-white/5 border border-white/10 p-3 rounded-xl mb-2 hover:bg-white/10 transition"
          >
            {/* User Info */}
            <div className="text-sm">
              {user.username}
              {user.role === "host" && " 👑"}
              {user.role === "moderator" && " 🛡"}
              {isSelf && " (You)"}
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap">
              
              {/* 👑 Transfer Host */}
              {isHost && user.role !== "host" && (
                <button
                  onClick={() => transferHost(user.socketId)}
                  className="px-3 py-1 text-xs rounded-lg bg-yellow-500/90 hover:bg-yellow-500 text-black font-medium transition"
                >
                  Make Host
                </button>
              )}
              {isHost && user.role === "moderator" && (
  <button
    onClick={() => assignRole(user.socketId, "participant")}
    className="px-3 py-1 text-xs rounded-lg bg-gray-600 hover:bg-gray-700 transition"
  >
    Remove Mod
  </button>
)}

              {/* 🛡 Make Moderator */}
              {isHost && user.role === "participant" && (
                <button
                  onClick={() => assignRole(user.socketId, "moderator")}
                  className="px-3 py-1 text-xs rounded-lg bg-blue-500/90 hover:bg-blue-500 transition"
                >
                  Make Mod
                </button>
              )}

              {/* ❌ Remove normal user */}
              {canManage && !isSelf && user.role !== "host" && (
                <button
                  onClick={() => removeUser(user.socketId)}
                  className="px-3 py-1 text-xs rounded-lg bg-red-500/90 hover:bg-red-500 transition"
                >
                  Remove
                </button>
              )}

              {/* 🔥 Remove Host (SAFE) */}
              {isHost && user.role === "host" && !isSelf && (
                <button
                  onClick={() => handleRemoveHost(user.socketId)}
                  className="px-3 py-1 text-xs rounded-lg bg-red-600 hover:bg-red-700 transition font-medium"
                >
                  Remove Host
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}