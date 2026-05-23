import { useState, useEffect } from "react";
import { Download, CheckCircle, Database, Server, Cpu, Check, AlertCircle } from "lucide-react";
import { Movie } from "../types";

interface DownloadSectionProps {
  movie: Movie;
  onClose?: () => void;
}

interface QualityOption {
  label: "480p" | "720p" | "1085p" | "4K";
  displayName: string;
  size: string;
  bitrate: string;
  recommendedNet: string;
}

export default function DownloadSection({ movie, onClose }: DownloadSectionProps) {
  const [selectedQuality, setSelectedQuality] = useState<string | null>(null);
  const [downloadStep, setDownloadStep] = useState<"idle" | "connecting" | "downloading" | "assembling" | "completed">("idle");
  const [progress, setProgress] = useState(0);

  const qualities = [
    { label: "480p", displayName: "Standard Definition (SD)", size: "450 MB", bitrate: "1.2 Mbps", recommendedNet: "3G" },
    { label: "720p", displayName: "High Definition (HD)", size: "1.2 GB", bitrate: "2.8 Mbps", recommendedNet: "4G / LTE" },
    { label: "1080p", displayName: "Full High Definition (FHD)", size: "2.8 GB", bitrate: "5.5 Mbps", recommendedNet: "WiFi / Broadband" },
    { label: "4K", displayName: "Ultra High Definition (UHD)", size: "8.4 GB", bitrate: "18 Mbps", recommendedNet: "Fiber Broadband" },
  ];

  const startDownloadSim = (quality: string) => {
    setSelectedQuality(quality);
    setDownloadStep("connecting");
    setProgress(0);
  };

  useEffect(() => {
    let timer: number;
    if (downloadStep === "connecting") {
      timer = window.setTimeout(() => {
        setDownloadStep("downloading");
      }, 1500);
    } else if (downloadStep === "downloading") {
      timer = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setDownloadStep("assembling");
            return 100;
          }
          // Increment random steps to simulate dynamic download speeds
          const increment = Math.floor(Math.random() * 8) + 4;
          return Math.min(prev + increment, 100);
        });
      }, 200);
    } else if (downloadStep === "assembling") {
      timer = window.setTimeout(() => {
        setDownloadStep("completed");
      }, 1800);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(timer);
    };
  }, [downloadStep]);

  return (
    <div className="bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-805/80 p-5 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-brand-red animate-bounce" />
            <span>Download High-Speed Chunks</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Choose files from our premium tier high-speed content delivery server.
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xs text-zinc-500 hover:text-white transition"
          >
            Cancel
          </button>
        )}
      </div>

      {downloadStep === "idle" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {qualities.map((q) => (
            <button
              key={q.label}
              onClick={() => startDownloadSim(q.label)}
              className="w-full text-left p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-brand-red hover:bg-zinc-900/40 transition flex items-center justify-between group cursor-pointer"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.2 bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs font-black rounded">
                    {q.label}
                  </span>
                  <span className="text-xs font-bold text-white group-hover:text-brand-red transition">
                    {q.displayName}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 font-medium">
                  Bitrate: {q.bitrate} • Rec: {q.recommendedNet}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-zinc-300 group-hover:text-white transition block">
                  {q.size}
                </span>
                <span className="text-[10px] text-zinc-500 font-bold group-hover:text-brand-red transition underline decoration-dotted mt-0.5 inline-block">
                  Speed link
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="p-6 rounded-xl bg-zinc-950/90 border border-zinc-800 space-y-6 flex flex-col items-center text-center">
          
          {/* Active step icon status mapping */}
          {downloadStep === "connecting" && (
            <div className="space-y-3 flex flex-col items-center">
              <div className="relative flex h-12 w-12 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red/20 opacity-75"></span>
                <Server className="relative w-8 h-8 text-brand-red" />
              </div>
              <div>
                <p className="text-sm font-bold text-white animate-pulse">Establishing secure connection...</p>
                <p className="text-xs text-zinc-500 mt-1">Connecting to premium CDN servers in Frankfurt</p>
              </div>
            </div>
          )}

          {downloadStep === "downloading" && (
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
                <span className="flex items-center gap-1">
                  <Database className="w-3.5 h-3.5 text-brand-red animate-pulse" />
                  Downloading segment: {selectedQuality}
                </span>
                <span className="font-mono text-brand-red font-bold text-sm">{progress}%</span>
              </div>

              {/* Progress Bar Container */}
              <div className="relative w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-brand-red rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-zinc-500 font-medium">
                <span>Speed: ~42.5 MB/s</span>
                <span>Time remaining: ~{Math.ceil((100 - progress) * 0.4)}s</span>
              </div>
            </div>
          )}

          {downloadStep === "assembling" && (
            <div className="space-y-3 flex flex-col items-center">
              <Cpu className="w-8 h-8 text-amber-500 animate-spin" />
              <div>
                <p className="text-sm font-bold text-white">Completing file decryption ...</p>
                <p className="text-xs text-zinc-500 mt-1">Validating CRC checksums and compiling sound chunks</p>
              </div>
            </div>
          )}

          {downloadStep === "completed" && (
            <div className="space-y-4 flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-500" strokeWidth={3} />
              </div>
              <div>
                <p className="text-base font-bold text-white">File Saved Successfully!</p>
                <p className="text-xs text-zinc-400 mt-1.5 px-4">
                  The {selectedQuality} MKV container package has been generated. Ready for offline playback on any media device.
                </p>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => {
                    setDownloadStep("idle");
                    setSelectedQuality(null);
                  }}
                  className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Download Another Quality
                </button>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="px-4 py-1.5 bg-brand-red hover:bg-red-700 text-white transition rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Back to Movies
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Secure details tracker line */}
          {downloadStep !== "completed" && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded text-[10px] text-zinc-500 font-semibold w-fit">
              <AlertCircle className="w-3.5 h-3.5 text-zinc-400" />
              <span>Safety checked: SHA-256 Verified Clean</span>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
