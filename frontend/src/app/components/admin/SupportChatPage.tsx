import { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, User } from "lucide-react";
import { adminFetch } from "../../utils/api";

interface Session {
  sessionId: string;
  lastMessage: string;
  sender: string;
  timestamp: string;
}

interface Message {
  sessionId: string;
  sender: "user" | "admin";
  text: string;
  timestamp: string;
}

export function SupportChatPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loadingSessions, setLoadingSessions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSessionRef = useRef<string | null>(null);

  // Sync activeSession to Ref for SSE listener closure
  useEffect(() => {
    activeSessionRef.current = activeSession;
  }, [activeSession]);

  // Fetch sessions list and setup EventSource listener
  useEffect(() => {
    const fetchSessions = () => {
      adminFetch("/api/support/sessions")
        .then((res) => res.json())
        .then((data) => {
          setSessions(data);
          setLoadingSessions(false);
        })
        .catch(console.error);
    };

    fetchSessions();

    const eventSource = new EventSource("/api/support/stream?isAdmin=true");

    eventSource.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg && msg.type !== "connected") {
          // If the message is for the currently open session, append it
          const currentActive = activeSessionRef.current;
          if (msg.sessionId === currentActive) {
            setMessages((prev) => {
              if (prev.some((m) => m.timestamp === msg.timestamp && m.text === msg.text)) {
                return prev;
              }
              return [...prev, msg];
            });
          }

          // Update the session's preview in the sidebar
          setSessions((prevSessions) => {
            const index = prevSessions.findIndex((s) => s.sessionId === msg.sessionId);
            const updatedSession = {
              sessionId: msg.sessionId,
              lastMessage: msg.text,
              sender: msg.sender,
              timestamp: msg.timestamp,
            };
            const newSessions = [...prevSessions];
            if (index !== -1) {
              newSessions.splice(index, 1);
            }
            return [updatedSession, ...newSessions];
          });
        }
      } catch (err) {
        console.error("Admin SSE parsing error:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("Admin EventSource error, closing connection:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Fetch messages for active session once when activeSession changes
  useEffect(() => {
    if (!activeSession) {
      setMessages([]);
      return;
    }

    const fetchMessages = () => {
      adminFetch(`/api/support/messages?sessionId=${activeSession}`)
        .then((res) => res.json())
        .then((data) => {
          setMessages(data);
        })
        .catch(console.error);
    };

    fetchMessages();
  }, [activeSession]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeSession) return;

    const body = {
      sessionId: activeSession,
      sender: "admin",
      text: inputText.trim(),
    };

    adminFetch("/api/support/messages", {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((newMsg) => {
        // Appended automatically by SSE, just clear inputs
        setInputText("");
      })
      .catch(console.error);
  };

  return (
    <div
      className="flex rounded-2xl overflow-hidden bg-white border border-stone-200"
      style={{ height: "calc(100vh - 170px)" }}
    >
      {/* Left pane: sessions list */}
      <div className="w-80 border-r border-stone-200 flex flex-col">
        <div className="p-4 border-b border-stone-100 bg-stone-50">
          <h2 className="text-sm font-bold text-stone-700 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#E8B4A8]" /> Hộp Thoại Hỗ Trợ
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
          {loadingSessions ? (
            <p className="p-4 text-xs text-stone-400 text-center animate-pulse">
              Đang tải danh sách chat...
            </p>
          ) : sessions.length === 0 ? (
            <p className="p-4 text-xs text-stone-400 text-center">
              Chưa có phiên chat nào hoạt động.
            </p>
          ) : (
            sessions.map((session) => {
              const active = activeSession === session.sessionId;
              return (
                <button
                  key={session.sessionId}
                  onClick={() => setActiveSession(session.sessionId)}
                  className={`w-full text-left p-4 hover:bg-stone-50 transition-colors flex items-start gap-3 ${active ? "bg-orange-50/40 border-l-4 border-[#E8B4A8] pl-3" : ""}`}
                >
                  <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-800 truncate">
                        {session.sessionId}
                      </span>
                      <span className="text-[9px] text-stone-400">
                        {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 truncate mt-1">
                      {session.sender === "admin" ? "Bạn: " : ""}{session.lastMessage}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right pane: message detail window */}
      <div className="flex-1 flex flex-col bg-stone-50/50">
        {activeSession ? (
          <>
            {/* Header */}
            <div className="p-4 bg-white border-b border-stone-200 flex items-center justify-between shadow-sm">
              <div>
                <h3 className="text-xs font-bold text-stone-800">
                  Phiên chat: {activeSession}
                </h3>
                <p className="text-[10px] text-green-600 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Đang trực tuyến
                </p>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => {
                const isAdmin = msg.sender === "admin";
                return (
                  <div
                    key={i}
                    className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 text-xs leading-relaxed shadow-sm ${
                        isAdmin
                          ? "bg-stone-900 text-white rounded-tr-none"
                          : "bg-white text-stone-800 rounded-tl-none border"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span
                        className={`text-[8px] mt-1 block text-right ${
                          isAdmin ? "text-stone-300" : "text-stone-400"
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Footer Input */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-stone-200 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Nhập nội dung phản hồi tin nhắn..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-xs bg-stone-50"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-stone-900 text-white hover:opacity-95 disabled:opacity-50 transition-opacity flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-stone-400">
            <MessageSquare className="w-12 h-12 mb-3 stroke-1 animate-bounce" />
            <h3 className="font-bold text-stone-700 text-sm">Chưa Chọn Phiên Chat</h3>
            <p className="text-xs text-stone-400 mt-1 max-w-xs leading-relaxed">
              Chọn một hội thoại bên cột trái để bắt đầu chat hỗ trợ khách hàng theo thời gian thực.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
