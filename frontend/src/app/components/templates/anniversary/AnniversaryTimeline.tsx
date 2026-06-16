import React from "react";
import { Camera, Calendar, Sparkles } from "lucide-react";
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

export default function AnniversaryTimeline({
  recipientName,
  title,
  message,
  photos = [],
  isEditing = false,
  onUpdate,
}: TemplateProps) {
  const handlePhotoClick = (index: number) => {
    if (!isEditing || !onUpdate) return;
    
    // Pool of romantic unsplash pictures
    const pool = [
      "https://images.unsplash.com/photo-1523521803700-b3bcaeab0150?w=400&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
      "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80"
    ];
    
    const newPhotos = [...photos];
    newPhotos[index] = pool[index % pool.length];
    onUpdate({ photos: newPhotos });
  };

  const activePhotos = [
    photos[0] || "https://images.unsplash.com/photo-1523521803700-b3bcaeab0150?w=400&q=80",
    photos[1] || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    photos[2] || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80",
  ];

  const milestones = [
    {
      title: "Khoảnh khắc đầu tiên",
      date: "Ngày gặp gỡ",
      desc: "Trái tim lần đầu loạn nhịp khi nhìn thấy nụ cười ấy.",
      img: activePhotos[0],
    },
    {
      title: "Lời ngỏ yêu thương",
      date: "Ngày ngỏ lời",
      desc: "Cái gật đầu dịu dàng mở ra một chương hạnh phúc mới.",
      img: activePhotos[1],
    },
    {
      title: "Hành trình vô hạn",
      date: "Hiện tại & Tương lai",
      desc: "Tay trong tay đi qua mọi giông bão cuộc đời.",
      img: activePhotos[2],
    },
  ];

  return (
    <div
      className="w-full min-h-[500px] p-6 flex flex-col justify-between text-[#7C5E43] rounded-[2rem] border-2 border-[#D4C4A8] shadow-2xl select-none font-sans relative"
      style={{
        background: "linear-gradient(180deg, #FAF7F4 0%, #EFE9DF 100%)",
      }}
    >
      <style>{`
        .timeline-paper-texture {
          background-color: #FAF7F4;
          background-image: radial-gradient(circle at 100% 150%, #FAF7F4 24%, #EFE9DF 28%, #EFE9DF 52%, transparent 52%),
            radial-gradient(circle at 0% 100%, #FAF7F4 15%, #EFE9DF 39%, #EFE9DF 42%, transparent 42%);
        }
      `}</style>

      {/* Header card info */}
      <div className="border-b border-[#D4C4A8]/60 pb-3.5 text-center mt-2 z-10">
        <Calendar className="w-6 h-6 mx-auto mb-1 text-[#8B7355] animate-pulse" />
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => onUpdate?.({ title: e.target.value })}
            className="w-full text-center text-sm font-black text-[#664C35] bg-transparent border-b border-dashed border-[#8B7355] focus:outline-none uppercase tracking-wider pl-2"
            placeholder="Kỷ Niệm Của Chúng Ta..."
          />
        ) : (
          <h2 className="text-sm font-black text-[#664C35] uppercase tracking-widest drop-shadow-sm">
            {title || "Dòng Thời Gian Kỷ Niệm"}
          </h2>
        )}
        <span className="text-[8px] font-semibold text-stone-400 tracking-[0.2em] uppercase mt-0.5 block">HÀNH TRÌNH</span>
      </div>

      {/* Vertical Interactive Timeline */}
      <div className="relative my-6 pl-4 border-l-2 border-dashed border-[#8B7355]/40 space-y-8 z-10 text-left">
        {milestones.map((milestone, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline dot */}
            <div className="absolute -left-[22px] top-1.5 w-3 h-3 rounded-full bg-[#8B7355] border-2 border-[#FAF7F4] shadow-md flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white animate-ping" />
            </div>

            {/* Content card */}
            <div className="bg-white/70 border border-white/60 p-3.5 rounded-2xl shadow-sm space-y-2.5 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-stone-200/50 pb-1.5">
                <span className="text-[11px] font-black text-[#664C35]">{milestone.title}</span>
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">{milestone.date}</span>
              </div>

              {/* Mounted Photo */}
              <div
                onClick={() => handlePhotoClick(idx)}
                className="relative h-24 rounded-lg overflow-hidden border border-stone-200/60 shadow-inner bg-stone-100 cursor-pointer group"
              >
                <img
                  src={milestone.img}
                  alt={milestone.title}
                  className="w-full h-full object-cover filter sepia-[0.2] contrast-[1.01] brightness-[0.97]"
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-20">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              <p className="text-[10px] text-stone-600 font-medium leading-relaxed italic">
                {milestone.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Love Message Summary Box */}
      <div className="bg-white/40 border border-white/50 p-4 rounded-2xl backdrop-blur-sm text-center z-10 flex flex-col gap-2 shadow-sm">
        {isEditing ? (
          <textarea
            value={message}
            onChange={(e) => onUpdate?.({ message: e.target.value })}
            className="w-full text-xs text-stone-700 bg-transparent border border-dashed border-[#D4C4A8] p-2 rounded-xl focus:outline-none h-14 resize-none leading-relaxed"
            placeholder="Điền lời chúc gửi đối phương..."
          />
        ) : (
          <p className="text-[11px] text-stone-700 font-medium leading-relaxed italic">
            "{message || "Những dấu mốc đáng nhớ nhất của chúng ta. Mong hành trình tương lai vẫn mãi rực rỡ và cùng nhau bước tiếp."}"
          </p>
        )}

        <div className="text-right border-t border-[#D4C4A8]/30 pt-2 flex items-center justify-end gap-1">
          <span className="text-[8px] font-bold text-stone-400">THƯƠNG GỬI,</span>
          {isEditing ? (
            <input
              type="text"
              value={recipientName}
              onChange={(e) => onUpdate?.({ recipientName: e.target.value })}
              className="text-right text-xs font-black text-[#664C35] bg-transparent focus:outline-none border-b border-dashed border-[#8B7355] w-24 inline-block pl-1"
              placeholder="Tên người nhận..."
            />
          ) : (
            <span className="text-xs font-black text-[#664C35] uppercase tracking-wide">
              {recipientName || "Bạn Kỷ Niệm"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
