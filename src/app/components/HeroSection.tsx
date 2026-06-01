import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 webo-animated-gradient" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background:
                i % 3 === 0 ? "#E8B4A8" : i % 3 === 1 ? "#FFD4D4" : "#D4AF78",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, -200],
              x: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                background: "var(--webo-glass-white)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <Sparkles className="w-4 h-4" style={{ color: "#E8B4A8" }} />
              <span
                className="text-sm font-medium"
                style={{ color: "#1A1818" }}
              >
                Tương Lai Của Món Quà Cảm Xúc
              </span>
            </motion.div>

            <h1
              className="mb-6 leading-tight"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                fontWeight: 700,
                color: "#1A1818",
              }}
            >
              Biến Mỗi Món Quà Thành{" "}
              <span
                className="relative inline-block"
                style={{
                  background:
                    "linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Ký Ức Số
              </span>
            </h1>

            <p
              className="mb-8 max-w-2xl mx-auto lg:mx-0"
              style={{
                fontSize: "clamp(1rem, 2vw, 1.25rem)",
                lineHeight: 1.6,
                color: "#4A4A4A",
              }}
            >
              WEMO sử dụng công nghệ NFC và trải nghiệm web động để tạo ra những
              món quà cảm xúc cá nhân hóa với ảnh, video, tin nhắn giọng nói và
              các mẫu tương tác.
            </p>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0">
              {[
                { value: "50K+", label: "Ký Ức Được Tạo" },
                { value: "4.9★", label: "Đánh Giá" },
                { value: "95%", label: "Hài Lòng" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="text-center"
                >
                  <div
                    className="font-bold mb-1"
                    style={{ fontSize: "1.5rem", color: "#E8B4A8" }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#6B6B6B" }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side - 3D Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main gift box mockup */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-20 rounded-3xl overflow-hidden shadow-2xl webo-glow"
              style={{
                background: "var(--webo-glass-white)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <video
                src="https://6a1d3eb50bc623d413b1bf46.imgix.net/wemo/t%E1%BA%A1o_s%E1%BB%B1_chuy%E1%BB%83n_%C4%91%E1%BB%99ng_ko_202606011546.mp4"
                className="w-full h-auto rounded-3xl"
                autoPlay
                loop
                muted
                playsInline
              />
            </motion.div>

            {/* Floating template cards */}
            {[
              {
                title: "Sinh Nhật",
                color: "#FFD4D4",
                img: "https://6a1d3eb50bc623d413b1bf46.imgix.net/wemo/t%E1%BA%A1o_h%C3%ACnh_%E1%BA%A3nh_1_s%E1%BA%A3n_202606011509.jpeg?w=2752&h=1536",
                position: { top: "10%", right: "-10%" },
              },
              {
                title: "Lãng Mạn",
                color: "#E8B4A8",
                img: "https://6a1d3eb50bc623d413b1bf46.imgix.net/wemo/t%E1%BA%A1o_h%C3%ACnh_%E1%BA%A3nh_1_s%E1%BA%A3n_202606011509.jpeg?w=2752&h=1536",
                position: { top: "50%", right: "-15%" },
              },
              {
                title: "Giáng Sinh",
                color: "#D4AF78",
                img: "https://6a1d3eb50bc623d413b1bf46.imgix.net/wemo/t%E1%BA%A1o_h%C3%ACnh_%E1%BA%A3nh_1_s%E1%BA%A3n_202606011509.jpeg?w=2752&h=1536",
                position: { bottom: "10%", right: "-10%" },
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -15, 0],
                }}
                transition={{
                  opacity: { delay: 0.5 + i * 0.2 },
                  y: {
                    duration: 3 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="absolute hidden lg:block w-32 h-40 rounded-2xl overflow-hidden shadow-xl"
                style={{
                  ...card.position,
                  background: "var(--webo-glass-white)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-24 object-cover"
                />
                <div className="p-2 text-center">
                  <div
                    className="text-xs font-semibold"
                    style={{ color: card.color }}
                  >
                    {card.title}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Smartphone scanning NFC */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -left-10 bottom-10 hidden md:block w-48 h-auto rounded-3xl shadow-2xl overflow-hidden"
              style={{
                background: "var(--webo-glass-white)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <img
                src="https://6a1d3eb50bc623d413b1bf46.imgix.net/wemo/t%E1%BA%A1o_h%C3%ACnh_%E1%BA%A3nh_1_s%E1%BA%A3n_202606011509.jpeg?w=2752&h=1536"
                alt="NFC Scanning"
                className="w-full h-auto"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full"
                style={{
                  background: "rgba(232, 180, 168, 0.3)",
                  border: "2px solid #E8B4A8",
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
