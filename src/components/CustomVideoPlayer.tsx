import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ArrowLeft,
  Settings,
  Tv,
  RotateCcw,
  RotateCw,
  Loader2
} from "lucide-react";

interface CustomVideoPlayerProps {
  videoUrl: string;
  movieTitle: string;
  onExit: () => void;
}

export default function CustomVideoPlayer({
  videoUrl,
  movieTitle,
  onExit,
}: CustomVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  // Play/Pause toggling
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch((err) => console.log("Playback error:", err));
    }
  };

  // Skip backward/forward by 10s
  const skipTime = (amount: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.currentTime + amount, duration));
  };

  // Video updates
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    setIsBuffering(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const value = parseFloat(e.target.value);
    videoRef.current.currentTime = value;
    setCurrentTime(value);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const value = parseFloat(e.target.value);
    setVolume(value);
    videoRef.current.volume = value;
    setIsMuted(value === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMute = !isMuted;
    setIsMuted(newMute);
    videoRef.current.muted = newMute;
  };

  const handleSpeedChange = (speed: number) => {
    if (!videoRef.current) return;
    setPlaybackSpeed(speed);
    videoRef.current.playbackRate = speed;
    setSpeedMenuOpen(false);
  };

  const handlePictureInPicture = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.log("Picture-in-picture failed:", err);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.log("Fullscreen error:", err));
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch((err) => console.log("Exit Fullscreen error:", err));
    }
  };

  // Format time (HH:)MM:SS
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const hrs = Math.floor(timeInSeconds / 3600);
    const mins = Math.floor((timeInSeconds % 3600) / 60);
    const secs = Math.floor(timeInSeconds % 60);

    const pad = (n: number) => (n < 10 ? `0${n}` : n);

    if (hrs > 0) {
      return `${hrs}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  // Hide controls after 3 seconds of mouse inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying && !speedMenuOpen) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    // Initial auto-play
    if (videoRef.current) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Auto-play was blocked, wait for user interaction
          setIsPlaying(false);
        });
    }

    return () => {
      if (controlsTimeoutRef.current) {
        window.clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [videoUrl]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full aspect-video bg-black overflow-hidden group/player"
      style={{ userSelect: "none" }}
    >
      {/* Actual HTML5 Video Tag */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onClick={togglePlay}
      />

      {/* Buffering Indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 pointer-events-none">
          <Loader2 className="w-12 h-12 text-brand-red animate-spin" />
        </div>
      )}

      {/* Control Overlays */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 flex flex-col justify-between p-4 transition-opacity duration-300 z-10 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Top bar header info */}
        <div className="flex items-center justify-between">
          <button
            onClick={onExit}
            className="flex items-center gap-2 p-2 rounded-lg bg-black/40 hover:bg-brand-red text-white text-sm font-semibold transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Exit Player
          </button>
          <div className="text-right">
            <h2 className="text-sm font-bold text-white leading-none">{movieTitle}</h2>
            <span className="text-[10px] text-zinc-400 font-semibold tracking-wider uppercase">Streaming Quality: Auto</span>
          </div>
        </div>

        {/* Big play button on screen center */}
        <div className="absolute inset-0 m-auto h-fit w-fit flex items-center justify-center pointer-events-none">
          {!isPlaying && !isBuffering && (
            <button
              onClick={togglePlay}
              className="p-5 bg-brand-red/90 hover:bg-brand-red text-white rounded-full flex items-center justify-center shadow-2xl scale-110 pointer-events-auto transition cursor-pointer"
            >
              <Play className="w-8 h-8 fill-current text-white translate-x-0.5" />
            </button>
          )}
        </div>

        {/* Bottom controls panel */}
        <div className="space-y-3 pt-4">
          {/* Custom Progress Scrubber */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-300">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 accent-brand-red h-1 bg-zinc-700/65 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-red/40"
            />
            <span className="text-xs font-mono text-zinc-300">
              {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            {/* Play, Pause, Skips & Volume controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="text-white hover:text-brand-red transition cursor-pointer"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              <button
                onClick={() => skipTime(-10)}
                className="text-zinc-300 hover:text-white transition cursor-pointer"
                title="Rewind 10s"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => skipTime(10)}
                className="text-zinc-300 hover:text-white transition cursor-pointer"
                title="Fast Forward 10s"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* Volume Scrubber bar */}
              <div className="flex items-center gap-1.5 group/volume">
                <button
                  onClick={toggleMute}
                  className="text-zinc-300 hover:text-white transition cursor-pointer"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-brand-red" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-0 group-hover/volume:w-18 accent-brand-red h-1 bg-zinc-700 rounded transition-all duration-300 appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Speeds, PiP & Grid toggles */}
            <div className="flex items-center gap-4">
              {/* Playback rate settings bubble */}
              <div className="relative">
                <button
                  onClick={() => setSpeedMenuOpen(!speedMenuOpen)}
                  className="p-1 px-2 border border-zinc-700 rounded bg-zinc-900 text-[10px] text-zinc-300 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>{playbackSpeed}x</span>
                </button>

                {speedMenuOpen && (
                  <div className="absolute bottom-full right-0 mb-2 w-24 bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden py-1 shadow-2xl z-20">
                    {[0.5, 1, 1.25, 1.5, 2].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSpeedChange(s)}
                        className={`w-full text-left px-3 py-1 text-xs transition ${
                          playbackSpeed === s
                            ? "bg-brand-red text-white font-bold"
                            : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* PiP */}
              <button
                onClick={handlePictureInPicture}
                className="text-zinc-400 hover:text-white transition cursor-pointer"
                title="Picture-in-Picture"
              >
                <Tv className="w-4 h-4" />
              </button>

              {/* Fullscreen toggle */}
              <button
                onClick={toggleFullscreen}
                className="text-zinc-400 hover:text-white transition cursor-pointer"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
