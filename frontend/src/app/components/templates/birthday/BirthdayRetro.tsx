import React, { useState } from "react";
import { Camera, Gamepad2, Volume2, VolumeX } from "lucide-react";
import { motion } from "motion/react";

type TemplateProps = {
  recipientName: string;
  title: string;
  message: string;
  photos: string[];
  isEditing?: boolean;
  onUpdate?: (fields: {
    title?: string;
    recipientName?: string;
    message?: string;
    photos?: string[];
  }) => void;
};

export default function BirthdayRetro({
  recipientName,
  title,
  message,
  photos = [],
  isEditing = false,
  onUpdate,
}: TemplateProps) {
  const [score, setScore] = useState(100);
  const [muted, setMuted] = useState(false);

  const handlePhotoClick = () => {
    if (!isEditing || !onUpdate) return;
    onUpdate({
      photos: [
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80",
      ],
    });
  };

  const retroPhoto = photos[0] || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80";

  return (
    <div
      className="w-full min-h-[500px] p-5 flex flex-col justify-between text-stone-900 rounded-[2.5rem] select-none border-[6px] border-stone-700 relative overflow-hidden shadow-2xl"
      style={{
        backgroundColor: "#9CA3AF", // Classic grey plastic body
        backgroundImage: "radial-gradient(#a3a3a3 15%, transparent 16%), radial-gradient(#a3a3a3 15%, transparent 16%)",
        backgroundSize: "8px 8px",
        backgroundPosition: "0 0, 4px 4px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        .font-pixel { font-family: 'Press Start 2P', monospace; }
        .green-matrix-screen {
          background-color: #9bbc0f; /* Original GB Green color */
          border: 4px solid #0f380f;
        }
      `}</style>

      {/* Screen Frame (Dark Grey glass with indicator lights) */}
      <div className="bg-[#5a5d64] p-4 rounded-xl border-2 border-stone-800 shadow-inner flex flex-col gap-2 relative">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1">
            {/* Battery Light Indicator */}
            <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse border border-stone-900" />
            <span className="text-[7px] text-white font-mono uppercase tracking-widest font-black">POWER</span>
          </div>
          <span className="text-[8px] text-[#2c3e50] font-pixel">AM THANH STEREO - MAN HINH 8-BIT</span>
        </div>

        {/* Green Matrix Screen content */}
        <div className="green-matrix-screen rounded-md p-3 flex flex-col justify-between gap-3 text-[#0f380f] font-pixel shadow-[inset_0_4px_6px_rgba(0,0,0,0.2)]">
          <div className="border-b border-[#0f380f] pb-2 text-center flex items-center justify-between">
            <span className="text-[6px]">&gt;B-DAY RUN</span>
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => onUpdate?.({ title: e.target.value })}
                className="text-right text-[7px] font-pixel bg-transparent border-b border-dashed border-[#0f380f] focus:outline-none uppercase text-[#0f380f] w-28"
                placeholder="MAN-01"
              />
            ) : (
              <span className="text-[7px] tracking-tight uppercase">
                {title || "DIEM: 100"}
              </span>
            )}
          </div>

          {/* 8-bit Mounted Game Art / Photo */}
          <div
            onClick={handlePhotoClick}
            className="relative h-24 rounded border-2 border-[#0f380f] bg-stone-100 overflow-hidden cursor-pointer group"
          >
            <img
              src={retroPhoto}
              alt="Retro scene"
              className="w-full h-full object-cover filter grayscale sepia-[0.8] contrast-[1.4] brightness-[0.9]"
            />
            {isEditing && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          {/* 8-bit Message area */}
          <div className="text-[8px] leading-relaxed text-left space-y-1.5 border-t border-[#0f380f]/50 pt-2">
            <div className="flex items-center gap-1 font-bold">
              <span>GUI:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => onUpdate?.({ recipientName: e.target.value })}
                  className="bg-transparent focus:outline-none border-b border-[#0f380f] text-[8px] font-pixel text-[#0f380f] flex-1"
                  placeholder="KHACH VIP"
                />
              ) : (
                <span className="truncate max-w-[80%] uppercase font-bold">{recipientName || "PLAYER 1"}</span>
              )}
            </div>

            <div className="flex flex-col gap-0.5">
              <span>TIN NHAN:</span>
              {isEditing ? (
                <textarea
                  value={message}
                  onChange={(e) => onUpdate?.({ message: e.target.value })}
                  className="w-full bg-transparent focus:outline-none border border-dashed border-[#0f380f]/40 p-1 text-[7px] font-pixel h-12 resize-none text-[#0f380f] leading-normal"
                  placeholder="LOI CHUC..."
                />
              ) : (
                <p className="leading-normal break-words">
                  {message || "Hay luon that ngau. Chuc ban tuoi moi ruc ro!"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* D-Pad & Control Buttons (Gameboy console face shell) */}
      <div className="mt-4 flex items-center justify-between px-3">
        {/* D-Pad (Cross Controller Button) */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Vertical axis */}
          <div className="absolute w-5 h-14 bg-stone-800 rounded-md border border-stone-900 shadow-md" />
          {/* Horizontal axis */}
          <div className="absolute h-5 w-14 bg-stone-800 rounded-md border border-stone-900 shadow-md" />
          {/* Center core */}
          <div className="absolute w-5 h-5 bg-stone-800" />
        </div>

        {/* Action Buttons (A/B Round Red Buttons) */}
        <div className="flex items-center gap-4 rotate-[-15deg] pr-1">
          {/* B Button */}
          <div className="flex flex-col items-center gap-0.5">
            <motion.button
              whileTap={{ scale: 0.9, y: 1 }}
              onClick={() => setScore((s) => Math.max(0, s - 10))}
              className="w-9 h-9 rounded-full bg-red-700 border-2 border-stone-900 flex items-center justify-center text-[10px] font-pixel text-red-100 shadow-md cursor-pointer select-none font-bold"
            >
              B
            </motion.button>
            <span className="text-[6px] font-pixel text-stone-600 font-bold uppercase mt-1">TAN CONG</span>
          </div>

          {/* A Button */}
          <div className="flex flex-col items-center gap-0.5">
            <motion.button
              whileTap={{ scale: 0.9, y: 1 }}
              onClick={() => setScore((s) => s + 10)}
              className="w-9 h-9 rounded-full bg-red-700 border-2 border-stone-900 flex items-center justify-center text-[10px] font-pixel text-red-100 shadow-md cursor-pointer select-none font-bold"
            >
              A
            </motion.button>
            <span className="text-[6px] font-pixel text-stone-600 font-bold uppercase mt-1">NHAY</span>
          </div>
        </div>
      </div>

      {/* Console Bottom Bar (Select/Start pill buttons, Speaker grills) */}
      <div className="mt-4 flex items-end justify-between px-4 pb-2">
        {/* Select & Start Pill Buttons */}
        <div className="flex items-center gap-3 py-1">
          <div className="flex flex-col items-center gap-1">
            <motion.button
              onClick={() => setMuted(!muted)}
              whileTap={{ y: 0.5 }}
              className="w-8 h-2.5 rounded-full bg-stone-800 border border-stone-900 rotate-[-28deg] shadow cursor-pointer flex items-center justify-center"
            >
              {muted ? <VolumeX className="w-1.5 h-1.5 text-stone-500" /> : <Volume2 className="w-1.5 h-1.5 text-stone-400" />}
            </motion.button>
            <span className="text-[5px] font-pixel text-stone-600 tracking-wider">NHAC</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <motion.button
              whileTap={{ y: 0.5 }}
              onClick={() => setScore(100)}
              className="w-8 h-2.5 rounded-full bg-stone-800 border border-stone-900 rotate-[-28deg] shadow cursor-pointer"
            />
            <span className="text-[5px] font-pixel text-stone-600 tracking-wider">RESET</span>
          </div>
        </div>

        {/* Speaker Grill slits */}
        <div className="flex items-center gap-1 rotate-[-28deg] opacity-70">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-1 h-8 bg-stone-800 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
