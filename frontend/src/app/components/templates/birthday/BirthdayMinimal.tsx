import React from "react";
import { Camera } from "lucide-react";
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

export default function BirthdayMinimal({
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
        "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=500&q=80",
      ],
    });
  };

  const minimalPhoto = photos[0] || "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=500&q=80";

  return (
    <div
      className="w-full min-h-[500px] p-6 flex flex-col justify-between text-stone-800 rounded-[2rem] relative overflow-hidden select-none border border-stone-200 shadow-2xl"
      style={{
        background: "linear-gradient(135deg, #FAF8F5 0%, #EBE8E2 100%)", // Warm linen/beige
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:wght@200..800&display=swap');
        .font-minimal-serif { font-family: 'Playfair Display', serif; }
        .font-minimal-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      {/* Decorative leaf sketch drawing */}
      <div className="absolute right-0 top-0 opacity-15 pointer-events-none w-32 h-44 mt-4 text-[#8C9A86]">
        <svg viewBox="0 0 100 150" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 140 C 20 110, 40 70, 70 20" />
          <path d="M30 100 C 15 90, 10 75, 12 70 C 14 65, 25 70, 35 90" fill="currentColor" fillOpacity="0.1" />
          <path d="M45 80 C 35 70, 32 55, 34 50 C 36 45, 45 52, 50 72" fill="currentColor" fillOpacity="0.1" />
          <path d="M58 58 C 50 48, 48 35, 50 30 C 52 25, 60 32, 63 50" fill="currentColor" fillOpacity="0.1" />
        </svg>
      </div>

      {/* Header section with fine serif font */}
      <div className="border-b border-stone-300 pb-4 mt-2 z-10 text-left">
        <span className="text-[8px] font-minimal-sans font-black tracking-[0.25em] text-[#8C9A86] block mb-1 uppercase">
          VẺ ĐẸP TINH TẾ
        </span>
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => onUpdate?.({ title: e.target.value })}
            className="w-full text-lg font-minimal-serif font-black text-stone-900 bg-transparent border-b border-dashed border-stone-400 focus:outline-none"
            placeholder="Tiêu đề..."
          />
        ) : (
          <h2 className="text-xl font-minimal-serif font-black text-stone-900 tracking-wide">
            {title || "Tuổi Mới Bình Yên"}
          </h2>
        )}
      </div>

      {/* Polaroid-like frame containing photos */}
      <div className="my-6 z-10 flex justify-center">
        <motion.div
          whileHover={{ scale: 1.02, rotate: -0.5 }}
          onClick={handlePhotoClick}
          className="bg-white p-3 pb-8 rounded-xl shadow-lg border border-stone-100 relative group cursor-pointer w-48 aspect-[3/4] flex flex-col"
        >
          <div className="flex-1 w-full rounded-lg overflow-hidden bg-stone-50 border border-stone-100">
            <img
              src={minimalPhoto}
              alt="Cozy scene"
              className="w-full h-full object-cover filter contrast-[1.01] brightness-[0.98]"
            />
          </div>
          {isEditing && (
            <div className="absolute inset-3 bottom-8 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity z-20">
              <Camera className="w-6 h-6 text-white" />
            </div>
          )}
          {/* Subtle text details on Polaroid margin */}
          <span className="absolute bottom-2 left-4 text-[7px] font-mono text-stone-400 tracking-widest uppercase">KỶ NIỆM WEMO</span>
        </motion.div>
      </div>

      {/* Structured asymmetrical typography */}
      <div className="flex flex-col gap-4 z-10 font-minimal-sans text-left pl-2">
        {isEditing ? (
          <textarea
            value={message}
            onChange={(e) => onUpdate?.({ message: e.target.value })}
            className="w-full text-xs font-minimal-sans text-stone-600 bg-transparent border border-dashed border-stone-300 p-2 rounded-xl focus:outline-none h-16 resize-none leading-relaxed"
            placeholder="Lời nhắn nhủ..."
          />
        ) : (
          <p className="text-xs text-stone-600 font-medium leading-loose tracking-wide border-l border-stone-300 pl-4 py-1">
            "{message || "Mong rằng những năm tháng tiếp theo của cuộc đời, bạn sẽ luôn vững bước với sự an yên trong tâm hồn."}"
          </p>
        )}

        {/* Sender Info block */}
        <div className="text-right pt-2 border-t border-stone-200/50 flex flex-col items-end">
          <span className="text-[7.5px] font-bold text-stone-400 block tracking-widest uppercase">Gửi trao đến</span>
          {isEditing ? (
            <input
              type="text"
              value={recipientName}
              onChange={(e) => onUpdate?.({ recipientName: e.target.value })}
              className="text-right text-xs font-black text-stone-900 bg-transparent focus:outline-none border-b border-dashed border-stone-400 w-24 inline-block mt-1 pl-1"
              placeholder="Tên..."
            />
          ) : (
            <p className="text-xs font-black text-stone-950 uppercase tracking-wider mt-1">
              ✦ {recipientName || "Bạn thân"} ✦
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
