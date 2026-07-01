import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Upload,
  Loader2,
  ArrowRight,
  Download,
  RefreshCw,
  AlertCircle,
  Image as ImageIcon,
  Home,
  Check,
  Wifi,
  ChevronRight,
  Camera,
  CameraOff,
  X
} from "lucide-react";
import { Link, useNavigate } from "react-router";

// Style list for the AI chibi generator
const CHIBI_STYLES = [
  {
    id: "cute-3d",
    name: "Chibi 3D Đất Sét",
    emoji: "🧸",
    description: "Mô hình đất sét 3D tròn trịa, phong cách hoạt hình Pixar dễ thương.",
    previewColor: "from-[#FF9A9E] to-[#FECFEF]",
  },
  {
    id: "anime",
    name: "Anime Truyền Thống",
    emoji: "🎨",
    description: "Nét vẽ anime Nhật Bản sắc sảo, đổ bóng mịn màng và màu tươi sáng.",
    previewColor: "from-[#84fab0] to-[#8fd3f4]",
  },
  {
    id: "royal",
    name: "Hoàng Gia Cổ Tích",
    emoji: "👑",
    description: "Trang phục hoàng tử/công chúa sang trọng có vương miện lấp lánh.",
    previewColor: "from-[#a1c4fd] to-[#c2e9fb]",
  },
  {
    id: "christmas",
    name: "Giáng Sinh Ấm Áp",
    emoji: "🎄",
    description: "Trang phục mùa đông ấm áp kèm mũ Noel, bối cảnh tuyết rơi nhẹ.",
    previewColor: "from-[#febb78] to-[#ff758c]",
  },
];

// Helper to compress and convert image to base64
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDim = 800; // Optimize dimension for faster AI upload

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = () => reject(new Error("Không thể xử lý ảnh chân dung."));
    };
    reader.onerror = () => reject(new Error("Không thể đọc tệp tin."));
  });
};

export function AIChibiPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // States
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState("cute-3d");
  const [generating, setGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [promptUsed, setPromptUsed] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  // Camera States
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    setShowCamera(true);
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }, // Selfie/Front camera
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error(err);
      setError("Không thể truy cập camera. Vui lòng kiểm tra quyền thiết bị.");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL("image/jpeg", 0.8);
      setSourceImage(base64);
      setGeneratedUrl(null);
    }
    stopCamera();
  };


  // Dynamic loading messages
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingSteps = [
    "🤖 Đang gửi chân dung đến máy chủ AI...",
    "🔍 AI đang phân tích đường nét khuôn mặt & kiểu tóc...",
    "🎨 Đang phác thảo khung xương Chibi 3D...",
    "✨ Đang dệt trang phục & phối tông màu pastel...",
    "💎 Đang dựng hình (Render) kết cấu 3D lấp lánh...",
    "🎉 Đang tối ưu hóa những chi tiết cuối cùng..."
  ];

  useEffect(() => {
    let interval: any;
    if (generating) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < loadingSteps.length - 1) return prev + 1;
          return prev;
        });
      }, 3500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [generating]);

  // Handlers
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    try {
      const base64 = await convertToBase64(file);
      setSourceImage(base64);
      setGeneratedUrl(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chỉ kéo thả tệp hình ảnh.");
      return;
    }
    setError(null);
    try {
      const base64 = await convertToBase64(file);
      setSourceImage(base64);
      setGeneratedUrl(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGenerate = async () => {
    if (!sourceImage) return;
    setGenerating(true);
    setError(null);
    setIsDemo(false);

    try {
      const res = await fetch("/api/ai/generate-chibi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: sourceImage,
          style: selectedStyle,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Tạo hình chibi thất bại.");
      }

      setGeneratedUrl(data.url);
      setPromptUsed(data.prompt || "");
      if (data.isDemo) {
        setIsDemo(true);
      }
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi kết nối máy chủ AI.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedUrl) return;
    try {
      if (generatedUrl.startsWith("http") && !generatedUrl.includes(window.location.host)) {
        window.open(generatedUrl, "_blank");
        return;
      }
      
      const response = await fetch(generatedUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `wemo-chibi-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(generatedUrl, "_blank");
    }
  };

  const handleCreateGift = () => {
    if (!generatedUrl) return;
    navigate(`/create?chibiUrl=${encodeURIComponent(generatedUrl)}`);
  };

  const handleReset = () => {
    setSourceImage(null);
    setGeneratedUrl(null);
    setPromptUsed("");
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-28 pb-16 font-sans relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#E8B4A8]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-[#D4AF78]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">
          <Link to="/" className="hover:text-stone-700 flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5" /> Trang chủ
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-stone-700">Vẽ Chibi AI</span>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8B4A8]/15 border border-[#E8B4A8]/30 text-[#e88d7b] text-xs font-black tracking-widest uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5 fill-[#E8B4A8]" />
              WEMO MAGIC STUDIO
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight leading-tight mb-4">
              Biến Ảnh Chân Dung Thành <br />
              <span className="bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78] bg-clip-text text-transparent">
                Mô Hình Chibi 3D
              </span>
            </h1>
            <p className="text-sm sm:text-base text-stone-500 font-medium leading-relaxed">
              Tải ảnh của bạn, nửa kia, hay bạn thân lên. Trí tuệ nhân tạo của WEMO sẽ phân tích khuôn mặt và thiết kế thành hình chibi 3D hoạt hình đáng yêu chỉ trong vài giây.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200/60 shadow-xl relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78]" />
              
              <AnimatePresence mode="wait">
                {!sourceImage && !generating && !generatedUrl && (
                  <motion.div
                    key="upload-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-6 text-center"
                  >
                    {showCamera ? (
                      <div className="relative rounded-3xl overflow-hidden border bg-black max-w-md mx-auto aspect-square md:aspect-video flex flex-col justify-between p-4 h-[350px]">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 pointer-events-none" />
                        <div className="z-10 flex justify-between items-start w-full">
                          <span className="text-[10px] bg-red-600 text-white font-bold px-2.5 py-0.5 rounded-full animate-pulse flex items-center gap-1">
                            ● LIVE CAMERA
                          </span>
                          <button
                            type="button"
                            onClick={stopCamera}
                            className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="z-10 flex gap-3 justify-center w-full pb-2">
                          <button
                            type="button"
                            onClick={stopCamera}
                            className="px-4 py-2 rounded-xl bg-stone-900/80 hover:bg-stone-900 text-white text-xs font-bold transition-all cursor-pointer"
                          >
                            Hủy bỏ
                          </button>
                          <button
                            type="button"
                            onClick={capturePhoto}
                            className="px-5 py-2 rounded-xl bg-[#E8B4A8] hover:opacity-95 text-white text-xs font-black shadow flex items-center gap-1.5 transition-all cursor-pointer hover:scale-103"
                          >
                            <Camera className="w-4 h-4" /> Chụp Ảnh
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={handleFileSelect}
                          className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                            isDragOver
                              ? "border-[#E8B4A8] bg-[#E8B4A8]/5 scale-[1.01]"
                              : "border-stone-200 hover:border-[#E8B4A8] hover:bg-stone-50/50"
                          }`}
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                          />
                          <div className="w-16 h-16 rounded-2xl bg-[#E8B4A8]/10 flex items-center justify-center text-[#E8B4A8] mb-4">
                            <Upload className="w-7 h-7" />
                          </div>
                          <h3 className="text-base font-bold text-stone-800 mb-1">
                            Kéo thả ảnh chân dung vào đây
                          </h3>
                          <p className="text-xs text-stone-400 mb-2">
                            Hoặc click để chọn tệp từ thiết bị
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3 justify-center items-center">
                          <button
                            type="button"
                            onClick={startCamera}
                            className="px-5 py-3 rounded-2xl border border-[#E8B4A8]/40 hover:bg-[#E8B4A8]/5 text-[#e88d7b] text-xs font-black flex items-center gap-2 cursor-pointer shadow-sm bg-white"
                          >
                            <Camera className="w-4 h-4 fill-[#E8B4A8]/20" /> Chụp Ảnh Trực Tiếp
                          </button>
                          
                          <div className="flex items-center gap-1.5 text-[9px] text-stone-400 font-bold uppercase tracking-wider bg-stone-100 px-3 py-2 rounded-xl border border-stone-200/40">
                            <ImageIcon className="w-3.5 h-3.5 text-stone-400" />
                            Định dạng: PNG, JPG, JPEG (Max 10MB)
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {generating && (
                  <motion.div
                    key="generating-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-16 flex flex-col items-center justify-center text-center"
                  >
                    <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#E8B4A8]/40 to-[#D4AF78]/40 animate-ping opacity-75" />
                      <div className="absolute -inset-2 rounded-full border border-dashed border-[#E8B4A8] animate-spin duration-10000" />
                      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#E8B4A8] to-[#D4AF78] shadow-lg flex items-center justify-center text-white relative z-10">
                        <Loader2 className="w-10 h-10 animate-spin" />
                      </div>
                    </div>

                    <h3 className="text-lg font-black text-stone-900 mb-2">
                      Studio AI Đang Vẽ Chibi...
                    </h3>
                    
                    <div className="h-6 overflow-hidden max-w-sm mx-auto mb-4">
                      <motion.p
                        key={loadingStep}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="text-sm font-bold text-[#E8B4A8] italic"
                      >
                        {loadingSteps[loadingStep]}
                      </motion.p>
                    </div>

                    <div className="w-full max-w-xs bg-stone-100 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78]"
                        initial={{ width: "0%" }}
                        animate={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mt-3">
                      Tiến trình: {Math.round(((loadingStep + 1) / loadingSteps.length) * 100)}%
                    </p>
                  </motion.div>
                )}

                {sourceImage && !generating && (
                  <motion.div
                    key="result-state"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest text-center">
                          Ảnh chân dung gốc
                        </p>
                        <div className="relative rounded-2xl overflow-hidden aspect-square border bg-stone-50 shadow-sm flex items-center justify-center">
                          <img
                            src={sourceImage}
                            alt="Ảnh gốc"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-bold text-[#D4AF78] uppercase tracking-widest text-center flex items-center justify-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 fill-[#D4AF78]" />
                          Mô hình chibi tạo ra
                        </p>
                        <div className="relative rounded-2xl overflow-hidden aspect-square border-2 border-[#D4AF78]/40 bg-stone-50 shadow-md flex items-center justify-center">
                          {generatedUrl ? (
                            <img
                              src={generatedUrl}
                              alt="Ảnh Chibi AI"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-center p-6 text-stone-400">
                              <ImageIcon className="w-10 h-10 mb-2 stroke-1" />
                              <p className="text-xs font-semibold">Chưa có ảnh chibi được tạo</p>
                              <p className="text-[10px] text-stone-400 mt-1">Bấm nút "Tạo Chibi bằng AI" bên phải để vẽ</p>
                            </div>
                          )}
                          
                          {generatedUrl && isDemo && (
                            <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-amber-500 text-white font-black text-[9px] uppercase tracking-widest shadow">
                              DEMO MODE
                            </div>
                          )}
                        </div>
                      </div>

                    </div>

                    {generatedUrl && promptUsed && (
                      <div className="p-4 rounded-2xl bg-stone-50 border text-stone-700 text-left space-y-1">
                        <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                          Ý tưởng AI thiết kế:
                        </p>
                        <p className="text-xs italic leading-relaxed text-stone-600 font-medium font-sans">
                          "{promptUsed}"
                        </p>
                      </div>
                    )}

                    {generatedUrl && (
                      <div className="flex flex-wrap gap-4 pt-2 justify-center md:justify-end">
                        <button
                          onClick={handleReset}
                          className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" /> Vẽ Ảnh Khác
                        </button>
                        
                        <button
                          onClick={handleDownload}
                          className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Download className="w-4 h-4 text-[#D4AF78]" /> Tải Về Máy
                        </button>

                        <button
                          onClick={handleCreateGift}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-stone-800 to-stone-950 hover:from-stone-900 hover:to-black text-white text-xs font-black shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-103"
                        >
                          Tạo Thiệp NFC Ngay <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="bg-stone-100 border p-5 rounded-3xl flex gap-3 text-stone-700 leading-relaxed text-left">
              <span className="text-xl">💡</span>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">Mẹo nhỏ để ảnh chibi đẹp nhất:</h4>
                <ul className="text-xs text-stone-500 list-disc pl-4 space-y-1.5">
                  <li>Sử dụng ảnh chân dung <strong>cận cảnh mặt</strong>, nhìn thẳng vào camera, chất lượng rõ nét.</li>
                  <li>Tránh ảnh chụp tập thể nhiều người, chụp từ quá xa, hoặc ảnh bị mờ tối.</li>
                  <li>Chọn đúng phong cách chibi mong muốn ở bảng điều khiển bên phải để AI phối màu chuẩn xác.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-5 border border-stone-200/60 shadow-lg text-left space-y-5">
              
              <div>
                <h3 className="text-sm font-black text-stone-800 uppercase tracking-widest flex items-center gap-1.5">
                  <span>🎨</span> Thiết Lập AI Chibi
                </h3>
                <p className="text-[11px] text-stone-400 mt-1">Cấu hình các tham số tạo ảnh chibi</p>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  1. Chọn phong cách vẽ
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {CHIBI_STYLES.map((style) => {
                    const isSelected = selectedStyle === style.id;
                    return (
                      <motion.button
                        key={style.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all relative overflow-hidden cursor-pointer ${
                          isSelected
                            ? "bg-[#E8B4A8]/5 border-[#E8B4A8]"
                            : "bg-white border-stone-150 hover:bg-stone-50"
                        }`}
                      >
                        <span className="text-2xl mt-0.5">{style.emoji}</span>
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-xs text-stone-800 flex items-center gap-1.5">
                            {style.name}
                            {isSelected && (
                              <span className="w-3.5 h-3.5 rounded-full bg-[#E8B4A8] flex items-center justify-center text-white">
                                <Check className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </h4>
                          <p className="text-[10px] text-stone-400 leading-normal font-medium">
                            {style.description}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100">
                {sourceImage ? (
                  <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="w-full py-3.5 bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78] hover:opacity-95 text-white rounded-2xl text-xs font-black tracking-widest uppercase shadow-md transition-all hover:scale-102 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-4.5 h-4.5 fill-white animate-pulse" />
                    Tạo Chibi bằng AI
                  </button>
                ) : (
                  <button
                    onClick={handleFileSelect}
                    className="w-full py-3.5 bg-stone-900 text-white rounded-2xl text-xs font-black tracking-widest uppercase hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-4.5 h-4.5" />
                    Chọn ảnh chân dung trước
                  </button>
                )}
                
                {error && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-100 flex items-start gap-1.5 leading-relaxed">
                    <AlertCircle className="w-4.5 h-4.5 shrink-0 text-rose-500 mt-0.5" />
                    <div>
                      <strong className="font-bold">Lỗi:</strong> {error}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
