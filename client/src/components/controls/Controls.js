"use client";

import { useEffect, useState } from "react";
import {
  playVideo,
  pauseVideo,
  seekVideo,
  changeVideo,
} from "@/api/socketApi";
import { extractYouTubeVideoId } from "@/lib/utils";

export default function Controls({ playerRef, currentUser }) {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [speed, setSpeed] = useState(1);
  const [videoInput, setVideoInput] = useState("");

  const isHost = currentUser?.role === "host";

  // 🔄 sync UI
  useEffect(() => {
    const interval = setInterval(() => {
      if (!playerRef.current) return;

      const current = playerRef.current.getCurrentTime();
      const total = playerRef.current.getDuration();
      const state = playerRef.current.getPlayerState();

      if (!isNaN(current)) setProgress(current);
      if (!isNaN(total)) setDuration(total);

      setIsPlaying(state === 1);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // ▶️ PLAY / PAUSE
  const togglePlay = () => {
    if (!playerRef.current || !isHost) return;

    const time = playerRef.current.getCurrentTime();

    if (isPlaying) {
      playerRef.current.pauseVideo();
      pauseVideo(time);
    } else {
      playerRef.current.playVideo();
      playVideo(time);
    }
  };

  // ⏩ SEEK
  const handleSeek = (e) => {
    const value = Number(e.target.value);

    if (!playerRef.current || !isHost) return;

    playerRef.current.seekTo(value, true);
    seekVideo(value);
  };

  // ⏪ / ⏩ SKIP
  const skip = (sec) => {
    if (!playerRef.current || !isHost) return;

    const newTime = playerRef.current.getCurrentTime() + sec;
    playerRef.current.seekTo(newTime, true);
    seekVideo(newTime);
  };

  // 🔊 VOLUME
  const handleVolume = (e) => {
    const val = Number(e.target.value);
    setVolume(val);

    if (!playerRef.current) return;
    playerRef.current.setVolume(val);
  };

  // ⚡ SPEED
  const handleSpeed = (e) => {
    const val = Number(e.target.value);
    setSpeed(val);

    if (!playerRef.current) return;
    playerRef.current.setPlaybackRate(val);
  };

  // 🎬 VIDEO CHANGE
  

  const handleChangeVideo = () => {
  if (!videoInput || !isHost) return;

  const videoId = extractYouTubeVideoId(videoInput);

  // ❌ invalid guard
  if (!videoId || videoId.length < 5) {
    alert("Invalid YouTube link");
    return;
  }

  console.log("🎬 VIDEO ID:", videoId); // debug

  changeVideo(videoId);
  setVideoInput("");
};

  // ⏱ format
  const formatTime = (time) => {
    if (!time) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full space-y-4">

      {/* 🎬 VIDEO CHANGE */}
      {isHost && (
        <div className="flex gap-2">
          <input
            value={videoInput}
            onChange={(e) => setVideoInput(e.target.value)}
            placeholder="Paste YouTube link or ID..."
            className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none text-sm"
          />
          <button
            onClick={handleChangeVideo}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-sm"
          >
            Load
          </button>
        </div>
      )}

      {/* 🔥 SEEK BAR */}
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={progress}
        onChange={handleSeek}
        disabled={!isHost}
        className="w-full h-2 rounded-lg bg-gray-700 accent-blue-500 cursor-pointer disabled:opacity-40"
      />

      {/* ⏱ TIME */}
      <div className="flex justify-between text-xs text-gray-400">
        <span>{formatTime(progress)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* 🎮 MAIN CONTROLS */}
      <div className="flex flex-wrap items-center justify-center gap-3">

        <button
          onClick={() => skip(-10)}
          disabled={!isHost}
          className="px-3 py-1 bg-white/10 rounded hover:bg-white/20 disabled:opacity-40"
        >
          ⏪ 10s
        </button>

        <button
          onClick={togglePlay}
          disabled={!isHost}
          className="px-4 py-2 bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-40"
        >
          {isPlaying ? "⏸ Pause" : "▶️ Play"}
        </button>

        <button
          onClick={() => skip(10)}
          disabled={!isHost}
          className="px-3 py-1 bg-white/10 rounded hover:bg-white/20 disabled:opacity-40"
        >
          10s ⏩
        </button>

      </div>

      {/* 🔊 VOLUME */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">🔊</span>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={handleVolume}
          className="flex-1 accent-green-500"
        />
      </div>

      {/* ⚡ SPEED */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">⚡</span>
        <select
          value={speed}
          onChange={handleSpeed}
          className="bg-black/40 border border-white/10 rounded px-2 py-1 text-sm"
        >
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={1.25}>1.25x</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2x</option>
        </select>
      </div>

      {/* 🔒 INFO */}
      {!isHost && (
        <p className="text-xs text-center text-gray-500">
          Only host can control playback
        </p>
      )}
    </div>
  );
}