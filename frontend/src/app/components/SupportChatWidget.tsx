import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Phone, MessageSquare, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  sender: "user" | "admin";
  text: string;
  timestamp: string;
}

export function SupportChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [sessionId, setSessionId] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Session ID
  useEffect(() => {
    let sId = localStorage.getItem("wemo_support_session_id");
    if (!sId) {
      sId = `Client-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      localStorage.setItem("wemo_support_session_id", sId);
    }
    setSessionId(sId);
  }, []);

  // Fetch messages history and connect to SSE stream
  useEffect(() => {
    if (!sessionId || !isOpen) return;

    // Load initial message history
    fetch(`/api/support/messages?sessionId=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
      })
      .catch(console.error);

    // Listen to real-time events via Server-Sent Events (SSE)
    const eventSource = new EventSource(`/api/support/stream?sessionId=${sessionId}`);

    eventSource.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg && msg.type !== "connected") {
          setMessages((prev) => {
            // Check for duplicates
            if (prev.some((m) => m.timestamp === msg.timestamp && m.text === msg.text)) {
              return prev;
            }
            return [...prev, msg];
          });
        }
      } catch (err) {
        console.error("SSE parsing error:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed, closing connection:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [sessionId, isOpen]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const body = {
      sessionId,
      sender: "user",
      text: inputText.trim(),
    };

    fetch("/api/support/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((newMsg) => {
        setMessages((prev) => [...prev, newMsg]);
        setInputText("");
      })
      .catch(console.error);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="w-80 h-96 rounded-3xl bg-white/80 border border-white/40 shadow-2xl backdrop-blur-md flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-black tracking-wide">WEMO Hỗ Trợ 24/7</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-stone-800 rounded-full text-stone-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Links Section */}
            <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-200 flex justify-around gap-2">
              <a
                href="tel:0987654321"
                className="flex-1 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 flex items-center justify-center gap-1.5 text-[10px] font-bold transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-[#E8B4A8]" /> Gọi Ngay
              </a>
              <a
                href="https://zalo.me/0987654321"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 flex items-center justify-center gap-1.5 text-[10px] font-bold transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5 text-blue-500" /> Chat Zalo
              </a>
            </div>

            {/* Messages body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/20">
              {messages.length === 0 ? (
                <div className="text-center p-6 text-stone-400">
                  <Sparkles className="w-8 h-8 text-[#E8B4A8] mx-auto mb-2 animate-bounce" />
                  <p className="text-[10px] font-bold text-stone-600">Xin chào!</p>
                  <p className="text-[9px] text-stone-500 mt-1 leading-relaxed">
                    Tôi là trợ lý WEMO. Vui lòng gửi tin nhắn nếu bạn cần trợ giúp kích hoạt thẻ NFC.
                  </p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isMe = msg.sender === "user";
                  return (
                    <div
                      key={i}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-3 py-1.5 text-[11px] leading-relaxed shadow-sm ${
                          isMe
                            ? "bg-stone-900 text-white rounded-tr-none"
                            : "bg-white text-stone-800 rounded-tl-none border"
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input field */}
            <form
              onSubmit={handleSend}
              className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-3 py-2 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-xs bg-stone-50"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 bg-stone-900 text-white rounded-xl hover:opacity-95 disabled:opacity-50 transition-opacity flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-stone-800 to-stone-950 text-white flex items-center justify-center shadow-2xl relative border border-stone-700"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        {/* Active badge */}
        <div className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center" />
      </motion.button>
    </div>
  );
}
