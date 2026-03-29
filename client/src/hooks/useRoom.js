import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { joinRoom } from "@/api/socketApi";

export const useRoom = ({ roomId, username, playerRef, isSyncingRef }) => {
  const [participants, setParticipants] = useState([]);
  const [videoState, setVideoState] = useState(null);
useEffect(() => {
  socket.on("participants", setParticipants);

  socket.on("sync-state", (state) => {
    console.log("🔥 SYNC STATE:", state);
    setVideoState(state);
  });

  socket.on("video_changed", (state) => {
    console.log("🎬 VIDEO CHANGED:", state);
    setVideoState(state);
  });

  socket.on("play", ({ time }) => {
    if (!playerRef.current) return;

    isSyncingRef.current = true;
    playerRef.current.seekTo(time, true);
    playerRef.current.playVideo();

    setTimeout(() => {
      isSyncingRef.current = false;
    }, 300);
  });

  socket.on("pause", ({ time }) => {
    if (!playerRef.current) return;

    isSyncingRef.current = true;
    playerRef.current.seekTo(time, true);
    playerRef.current.pauseVideo();

    setTimeout(() => {
      isSyncingRef.current = false;
    }, 300);
  });

  socket.on("seek", ({ time }) => {
    if (!playerRef.current) return;

    isSyncingRef.current = true;
    playerRef.current.seekTo(time, true);

    setTimeout(() => {
      isSyncingRef.current = false;
    }, 300);
  });

  socket.on("kicked", () => {
    alert("You were removed");
    window.location.href = "/";
  });

  const handleConnect = () => {
    console.log("🟢 Connected:", socket.id);
    joinRoom({ roomId, username });
  };

  socket.on("connect", handleConnect);

  if (!socket.connected) {
    socket.connect();
  }

  return () => {
    socket.off("participants");
    socket.off("sync-state");
    socket.off("video_changed");
    socket.off("play");
    socket.off("pause");
    socket.off("seek");
    socket.off("kicked");
    socket.off("connect", handleConnect);
  };
}, [roomId]);

  return { participants, videoState };
};