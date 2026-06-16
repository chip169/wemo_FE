import React, { useState, useEffect } from "react";
import { Camera, Heart, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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

function LoveHeartParticle({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute text-rose-400/30 pointer-events-none select-none"
      style={{
        left: `${Math.random() * 100}%`,
        bottom: "-10px",
        fontSize: `${10 + Math.random() * 15}px`,
      }}
      animate={{
        y: ["0vh", "-85vh"],
        x: [0, (Math.random() - 0.5) * 50],
        rotate: [0, 360],
        opacity: [0.8, 0],
      }}
      transition={{
        duration: 5 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      ❤️
    </motion.div>
  );
}

export default function LoveRomantic({
  recipientName,
  title,
  message,
  photos = [],
  isEditing = false,
  onUpdate,
}: TemplateProps) {
  const [heartCount, setHeartCount] = useState(99);
  const [clicked, setClicked] = useState(false);

  const handlePhotoClick = () => {
    if (!isEditing || !onUpdate) return;
    onUpdate({
      photos: [
        "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&q=80",
      ],
    });
  };

  const lovePhoto = photos[0] || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&q=80";

  return (
    <div
      className="w-full min-h-[500px] p-6 flex flex-col justify-between text-rose-950 rounded-[2rem] relative overflow-hidden font-serif border border-rose-200/50 shadow-2xl select-none"
      style={{
        background: "linear-gradient(135deg, #FFEBEB 0%, #FFCCD5 100%)",
      }}
    >
      {/* Decorative particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <LoveHeartParticle key={i} delay={i * 0.7} />
        ))}
      </div>

      {/* Header section */}
      <div className="text-center z-10 space-y-1.5 mt-2">
        <Heart className="w-7 h-7 mx-auto text-rose-600 fill-rose-500 animate-pulse" />
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => onUpdate?.({ title: e.target.value })}
            className="w-full text-center text-lg font-black text-rose-900 bg-transparent border-b border-dashed border-rose-400 focus:outline-none placeholder-rose-700"
            placeholder="Mãi Yêu Thương..."
          />
        ) : (
          <h2 className="text-xl font-black text-rose-900 tracking-wide drop-shadow-sm">
            {title || "Mãi Yêu Thương"}
          </h2>
        )}
        <span className="text-[9px] font-bold text-rose-400 tracking-[0.2em] uppercase block">BỨC THƯ TÌNH</span>
      </div>

      {/* Picture Frame with Gold/Rose gold borders */}
      <div className="my-5 flex justify-center z-10">
        <motion.div
          whileHover={{ scale: 1.03 }}
          onClick={handlePhotoClick}
          className="relative w-44 h-44 rounded-full p-2 bg-gradient-to-tr from-[#D4AF78] via-rose-300 to-[#F3E0C3] shadow-[0_15px_35px_rgba(219,39,119,0.25)] cursor-pointer group"
        >
          <div className="w-full h-full rounded-full overflow-hidden border-4 border-white bg-stone-100">
            <img
              src={lovePhoto}
              alt="Love Memory"
              className="w-full h-full object-cover filter contrast-[1.02] brightness-[0.98]"
            />
          </div>
          {isEditing && (
            <div className="absolute inset-2 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition-opacity z-20">
              <Camera className="w-6 h-6 text-white" />
            </div>
          )}
        </motion.div>
      </div>

      {/* Glassmorphic message container */}
      <div className="bg-white/50 border border-white/60 rounded-2xl p-5 shadow-[0_10px_25px_rgba(0,0,0,0.03)] backdrop-blur-md z-10 flex flex-col gap-3 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-rose-200/40 rounded-full blur-xl pointer-events-none" />
        
        {isEditing ? (
          <textarea
            value={message}
            onChange={(e) => onUpdate?.({ message: e.target.value })}
            className="w-full text-xs font-medium text-rose-900 bg-transparent border border-dashed border-rose-300 p-2 rounded-xl focus:outline-none h-18 resize-none leading-relaxed italic"
            placeholder="Nhập những lời yêu thương..."
          />
        ) : (
          <p className="text-xs font-semibold leading-loose text-center text-rose-900/90 italic tracking-wide">
            "{message || "Cảm ơn vì đã luôn ở bên, chia sẻ mọi vui buồn và là động lực lớn nhất của đời anh."}"
          </p>
        )}

        {/* Recipient area */}
        <div className="text-center border-t border-rose-200/60 pt-3 flex flex-col items-center">
          <span className="text-[8px] font-bold text-rose-400 block tracking-widest">GỬI CHO NỬA KIA</span>
          {isEditing ? (
            <input
              type="text"
              value={recipientName}
              onChange={(e) => onUpdate?.({ recipientName: e.target.value })}
              className="text-center text-sm font-black text-rose-800 bg-transparent focus:outline-none border-b border-dashed border-rose-400 w-32 mt-1"
              placeholder="Tên người thương..."
            />
          ) : (
            <div className="flex items-center gap-1.5 mt-1 font-black text-sm text-rose-800 tracking-wider">
              <span>💖</span>
              <span>{recipientName || "Người Thương"}</span>
              <span>💖</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Interactive Actions */}
      <div className="flex items-center justify-between px-3 mt-4 z-10">
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-rose-500 font-bold tracking-wider">Luv:</span>
          <span className="text-[10px] text-stone-600 font-mono font-bold">{heartCount}</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setHeartCount(clicked ? heartCount - 1 : heartCount + 1);
            setClicked(!clicked);
          }}
          className={`w-8 h-8 rounded-full border shadow-sm flex items-center justify-center cursor-pointer transition-all ${
            clicked ? "bg-rose-500 border-rose-400 text-white" : "bg-white/80 border-rose-200 text-rose-500 hover:bg-rose-50"
          }`}
        >
          <Heart className={`w-4 h-4 ${clicked ? "fill-white" : ""}`} />
        </motion.button>
      </div>
    </div>
  );
}
