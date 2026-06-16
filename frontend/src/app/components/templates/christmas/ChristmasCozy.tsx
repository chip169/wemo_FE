import React from "react";
import { Camera, Sparkles } from "lucide-react";
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

function SnowflakeParticle({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute text-white/40 pointer-events-none select-none"
      style={{
        left: `${Math.random() * 100}%`,
        top: "-15px",
        fontSize: `${8 + Math.random() * 12}px`,
      }}
      animate={{
        y: ["0vh", "90vh"],
        x: [0, (Math.random() - 0.5) * 30],
        rotate: [0, 360],
        opacity: [0.9, 0],
      }}
      transition={{
        duration: 6 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      ❄️
    </motion.div>
  );
}

export default function ChristmasCozy({
  recipientName,
  title,
  message,
  photos = [],
  isEditing = false,
  onUpdate,
}: TemplateProps) {
  const handlePhotoClick = () => {
    if (!isEditing || !onUpdate) return;
    onUpdate({
      photos: [
        "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=400&q=80",
      ],
    });
  };

  const xmasPhoto = photos[0] || "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=400&q=80";

  return (
    <div
      className="w-full min-h-[500px] p-6 flex flex-col justify-between text-[#F5E6C4] rounded-[2rem] relative overflow-hidden shadow-2xl border-4 border-[#D4AF78]/30 select-none font-sans"
      style={{
        background: "linear-gradient(135deg, #1A3E2F 0%, #11261B 100%)", // Forest Green
      }}
    >
      {/* Falling snow effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <SnowflakeParticle key={i} delay={i * 0.6} />
        ))}
      </div>

      {/* Decorative Christmas Tree top ornament */}
      <div className="text-center z-10 space-y-1.5 mt-2">
        <div className="text-2xl text-amber-400 fill-amber-400 animate-pulse">🎄</div>
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => onUpdate?.({ title: e.target.value })}
            className="w-full text-center text-lg font-black text-white bg-transparent border-b border-dashed border-[#F5E6C4]/40 focus:outline-none placeholder-[#F5E6C4]"
            placeholder="Giáng Sinh An Lành..."
          />
        ) : (
          <h2 className="text-xl font-black text-white tracking-widest uppercase drop-shadow-md">
            {title || "Mùa Noel Ấm Áp"}
          </h2>
        )}
        <span className="text-[8px] font-bold text-[#D4AF78] tracking-[0.25em] uppercase block">Giáng Sinh An Lành</span>
      </div>

      {/* Main card Photo Frame with Red velvet border */}
      <div className="my-5 flex justify-center z-10">
        <motion.div
          whileHover={{ scale: 1.03 }}
          onClick={handlePhotoClick}
          className="relative w-44 h-44 rounded-2xl p-2 bg-gradient-to-tr from-[#9B1C31] to-[#D32F2F] shadow-[0_15px_30px_rgba(0,0,0,0.4)] cursor-pointer group border-2 border-[#D4AF78]/50"
        >
          <div className="w-full h-full rounded-xl overflow-hidden border-2 border-white bg-stone-100">
            <img
              src={xmasPhoto}
              alt="Christmas cozy scene"
              className="w-full h-full object-cover filter contrast-[1.01] brightness-[0.98]"
            />
          </div>
          {isEditing && (
            <div className="absolute inset-2 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity z-20">
              <Camera className="w-6 h-6 text-white" />
            </div>
          )}
        </motion.div>
      </div>

      {/* Cozy Christmas Message container */}
      <div className="bg-white/10 border border-white/10 rounded-2xl p-5 shadow-[inset_0_2px_4px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.15)] backdrop-blur-md z-10 flex flex-col gap-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-2 rounded-full bg-red-500 animate-pulse m-3" />
        <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-yellow-500 animate-pulse m-3" />

        {isEditing ? (
          <textarea
            value={message}
            onChange={(e) => onUpdate?.({ message: e.target.value })}
            className="w-full text-xs font-semibold text-white/90 bg-transparent border border-dashed border-white/20 p-2 rounded-xl focus:outline-none h-18 resize-none leading-relaxed"
            placeholder="Viết lời nhắn Noel ấm áp..."
          />
        ) : (
          <p className="text-xs font-semibold leading-loose text-center text-[#F5E6C4] drop-shadow-sm tracking-wide">
            "{message || "Mùa Noel Ấm Áp"}"
          </p>
        )}

        {/* Sender details */}
        <div className="text-center border-t border-white/15 pt-3 flex flex-col items-center">
          <span className="text-[7.5px] font-bold text-[#D4AF78] tracking-widest block uppercase">Ấm áp trao</span>
          {isEditing ? (
            <input
              type="text"
              value={recipientName}
              onChange={(e) => onUpdate?.({ recipientName: e.target.value })}
              className="text-center text-xs font-black text-white bg-transparent focus:outline-none border-b border-dashed border-[#F5E6C4] w-32 mt-1"
              placeholder="Tên người nhận..."
            />
          ) : (
            <div className="flex items-center gap-1 mt-1 font-black text-xs text-white uppercase tracking-wider">
              <span>❄️</span>
              <span>{recipientName || "Người Thương"}</span>
              <span>❄️</span>
            </div>
          )}
        </div>
      </div>

      {/* Christmas decorations footer */}
      <div className="flex justify-center items-center gap-3 text-[#D4AF78] opacity-75 mt-3 z-10">
        <Sparkles className="w-3.5 h-3.5 animate-spin" />
        <span className="text-[8px] font-bold tracking-[0.2em] uppercase font-mono">Thiệp Mùa Đông Ấm Áp</span>
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
      </div>
    </div>
  );
}
