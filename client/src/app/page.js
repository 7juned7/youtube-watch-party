"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const handleJoin = () => {
    if (!roomId || !username) return;
    router.push(`/room/${roomId}?username=${username}`);
  };

  const handleCreate = () => {
    if (!username) return;
    const newRoomId = Math.random().toString(36).substring(2, 8);
    router.push(`/room/${newRoomId}?username=${username}`);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-blue-600/30 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-purple-600/30 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)]">

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            🎬 Watch Party
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Sync. Watch. Enjoy together.
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <input
            placeholder="Enter username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-500"
          />

          <input
            placeholder="Enter room ID..."
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition placeholder-gray-500"
          />
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={handleJoin}
            className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/20"
          >
            Join Room
          </button>

          <button
            onClick={handleCreate}
            className="w-full py-3 rounded-xl font-semibold bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-200"
          >
            Create New Room
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-gray-500">OR</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center">
          ⚡ Real-time sync • 🎮 Host control • 🚀 Zero lag
        </p>
      </div>
    </div>
  );
}