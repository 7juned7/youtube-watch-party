"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { socket } from "@/lib/socket";

import { useRoom } from "@/hooks/useRoom";
import Controls from "@/components/controls/Controls";
import Participants from "@/components/participants/Participants";
import VideoPlayer from "@/components/video/videoPlayer";

export default function RoomPage() {
  const { roomId } = useParams();
  const searchParams = useSearchParams();

  const username = searchParams.get("username") || "Guest";

  const playerRef = useRef(null);
  const isSyncingRef = useRef(false);

  const [socketId, setSocketId] = useState(null);

  const { participants, videoState } = useRoom({
    roomId,
    username,
    playerRef,
    isSyncingRef,
  });

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
    });

    return () => socket.off("connect");
  }, []);

  const currentUser = participants.find(
    (u) => u.socketId === socketId
  );

  return (
    <div className="h-screen bg-black text-white flex overflow-hidden">

      {/* 🔹 Sidebar (Participants) */}
      <div className="w-[300px] border-r border-white/10 bg-white/5 backdrop-blur-xl p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">👥 Participants</h2>

        <Participants
          users={participants}
          currentUser={currentUser}
        />
      </div>

      {/* 🔹 Main Content */}
      <div className="flex-1 flex flex-col p-4 gap-4">

        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            🎬 Room: {roomId}
          </h1>

          <span className="text-sm text-gray-400">
            {username}
          </span>
        </div>

        {/* Video Section */}
        <div className="flex-1 rounded-2xl overflow-hidden border border-white/10 bg-black">
          <VideoPlayer
            videoState={videoState}
            playerRef={playerRef}
            isSyncingRef={isSyncingRef}
          />
        </div>

        {/* Controls */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
          <Controls
            playerRef={playerRef}
            currentUser={currentUser}
          />
        </div>
      </div>
    </div>
  );
}