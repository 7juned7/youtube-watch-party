"use client";

import YouTube from "react-youtube";
import { useEffect, useRef } from "react";
import { playVideo, pauseVideo, seekVideo } from "@/api/socketApi";

export default function VideoPlayer({
  videoState,
  playerRef,
  isSyncingRef,
}) {
  const readyRef = useRef(false);
  const lastVideoIdRef = useRef(null);

  const applySync = (state) => {
    if (!playerRef.current) return;

    isSyncingRef.current = true;

    playerRef.current.seekTo(state.currentTime || 0, true);

    if (state.isPlaying) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }

    setTimeout(() => {
      isSyncingRef.current = false;
    }, 300);
  };

  // ✅ PLAYER READY
  const onReady = (event) => {
    playerRef.current = event.target;
    readyRef.current = true;
  };

  // 🔥 MAIN SYNC ENGINE
  useEffect(() => {
    if (!readyRef.current || !videoState) return;

    const currentVideo =
      playerRef.current.getVideoData()?.video_id;

    // 🎬 VIDEO CHANGE (REAL FIX)
    if (videoState.videoId && currentVideo !== videoState.videoId) {
      lastVideoIdRef.current = videoState.videoId;

      isSyncingRef.current = true;

      try {
        playerRef.current.loadVideoById({
          videoId: videoState.videoId,
          startSeconds: videoState.currentTime || 0,
        });
      } catch (e) {
        console.log("load error", e);
        return;
      }

      setTimeout(() => {
        if (!playerRef.current) return;

        if (videoState.isPlaying) {
          playerRef.current.playVideo();
        } else {
          playerRef.current.pauseVideo();
        }

        isSyncingRef.current = false;
      }, 300);

      return;
    }

    // 🔁 NORMAL SYNC
    applySync(videoState);
  }, [videoState]);

  

  // 🔁 SEEK DETECTION
  useEffect(() => {
    let last = 0;

    const interval = setInterval(() => {
      if (!playerRef.current) return;

      const current = playerRef.current.getCurrentTime();

      if (Math.abs(current - last) > 2 && !isSyncingRef.current) {
        seekVideo(current);
      }

      last = current;
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!videoState?.videoId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No video loaded
      </div>
    );
  }

  return (
    <div className=" pointer-events-none w-full h-full">
      <YouTube
      className="w-full h-full"
  videoId={videoState.videoId}
  opts={{
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 0,
  controls: 0,        // ❌ controls hide
  disablekb: 1,       // ❌ keyboard disable
  modestbranding: 1,  // ❌ logo reduce
  rel: 0,             // ❌ related videos limit
  fs: 0,              // ❌ fullscreen button hide
  iv_load_policy: 3,  // ❌ annotations off
  cc_load_policy: 0,  
    },
  }}
   iframeClassName="w-full h-full"
  onReady={onReady}
/>
    </div>
  );
}