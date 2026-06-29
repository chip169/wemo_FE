import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Music, Play, Pause, Sparkles, Volume2 } from "lucide-react";
import { RenderLiveTemplate } from "./GiftWizard";

const MUSIC_URLS = {
  piano: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  romantic: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  birthday: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
};

function FloatingParticle({ color, delay }: { color: string; delay: number }) {
  return (
    <motion.div
      className="absolute w-2.5 h-2.5 rounded-full pointer-events-none"
      style={{
        background: color,
        left: `${Math.random() * 100}%`,
        top: "-10px",
        opacity: 0.6,
      }}
      animate={{
        y: ["0vh", "110vh"],
        x: [0, (Math.random() - 0.5) * 100],
        rotate: [0, 360],
        opacity: [0.8, 0],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

export function GiftViewPage() {
  const { giftId } = useParams<{ giftId: string }>();
  const [gift, setGift] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle music playing state
  useEffect(() => {
    if (gift && gift.music !== "none") {
      const url = MUSIC_URLS[gift.music as keyof typeof MUSIC_URLS];
      if (url) {
        if (!audioRef.current) {
          const audio = new Audio(url);
          audio.loop = true;
          audioRef.current = audio;
        }

        if (isPlayingMusic) {
          audioRef.current.play().catch((err) => {
            console.log("Autoplay blocked, waiting for interaction:", err);
            setIsPlayingMusic(false);
          });
        } else {
          audioRef.current.pause();
        }
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [gift, isPlayingMusic]);

  useEffect(() => {
    const fetchGift = async () => {
      try {
        const res = await fetch(`/api/gifts/${giftId}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Không thể tải thiệp quà tặng.");
        }
        setGift(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (giftId) fetchGift();
  }, [giftId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E8B4A8] to-[#D4AF78] flex items-center justify-center text-white"
        >
          <Heart className="w-6 h-6 fill-white" />
        </motion.div>
        <p className="mt-4 text-xs font-bold text-stone-500 uppercase tracking-widest animate-pulse">
          Đang tải thiệp quà tặng...
        </p>
      </div>
    );
  }

  if (error || !gift) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] relative overflow-hidden flex flex-col items-center justify-center p-6 text-center select-none">
        {/* Glowing shapes */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-[#E8B4A8]/10 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-[#D4AF78]/10 blur-[80px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm p-8 rounded-[2.5rem] bg-white/70 border border-white/40 shadow-2xl backdrop-blur-md relative z-10 flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mb-5 border border-amber-100 shadow-inner">
            <span className="text-3xl">⚠️</span>
          </div>
          
          <h2 className="text-lg font-extrabold text-stone-900 mb-2">Không Tìm Thấy Quà Tặng</h2>
          <p className="text-xs text-stone-500 max-w-xs mb-6 leading-relaxed">
            Liên kết quà tặng này không tồn tại hoặc đã hết hạn xác thực trên hệ thống WEMO.
          </p>

          <Link
            to="/"
            className="w-full py-3 bg-gradient-to-r from-stone-800 to-stone-950 text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95 text-center active:scale-98 transition-all block cursor-pointer"
          >
            Quay lại Trang Chủ
          </Link>
        </motion.div>

        <p className="mt-8 text-[10px] text-stone-400 font-bold uppercase tracking-widest relative z-10">
          WEMO NFC PLATFORM
        </p>
      </div>
    );
  }

  // Define particle colors based on template/theme
  const particleColors =
    gift.theme === "sinh-nhat"
      ? ["#FF6B8A", "#FFD4D4", "#FF9A9E", "#FECFEF", "#FFE066"]
      : gift.theme === "tinh-yeu"
        ? ["#FF4D4D", "#FFA3A3", "#FFEBEB", "#FFC1C1", "#FFF0F0"]
        : gift.theme === "giang-sinh"
          ? ["#FFFFFF", "#2D5016", "#D4AF78", "#FF4444", "#4A7C2F"]
          : ["#8B7355", "#D4C4A8", "#C4B498", "#E6DFD5", "#FAF7F4"];

  return (
    <div className="h-screen w-full overflow-y-auto no-scrollbar bg-[#FAF8F5] relative flex flex-col items-center justify-start py-8 px-4 md:py-12">
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <FloatingParticle
            key={i}
            color={particleColors[i % particleColors.length]}
            delay={i * 0.4}
          />
        ))}
      </div>

      {/* Interactive Music Widget */}
      {gift.music !== "none" && (
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setIsPlayingMusic(!isPlayingMusic)}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md border bg-white text-stone-700 transition-all ${isPlayingMusic ? "border-orange-200 text-[#E8B4A8] scale-105 animate-pulse" : "border-stone-200"}`}
          >
            {isPlayingMusic ? <Volume2 className="w-5 h-5" /> : <Music className="w-5 h-5 text-stone-400" />}
          </button>
          {isPlayingMusic && (
            <div className="absolute top-12 right-0 bg-stone-900 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
              Đang phát nhạc nền...
            </div>
          )}
        </div>
      )}

      {/* Main card viewport - clean responsive container instead of phone chassis */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-stone-200/60 bg-white"
      >
        <RenderLiveTemplate gift={gift} isEditing={false} />
      </motion.div>

      {/* Info bottom */}
      <p className="mt-5 text-[10px] text-stone-400 font-medium uppercase tracking-widest flex items-center gap-1">
        <span>Thiệp được tạo bởi</span>
        <span className="font-bold text-stone-500">WEMO NFC</span>
      </p>
    </div>
  );
}
