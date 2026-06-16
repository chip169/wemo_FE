import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  ShoppingCart,
  Gift,
  Wifi,
  Layers,
  Users,
  BarChart3,
  Settings,
  Search,
  Bell,
  Moon,
  Sun,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  MessageSquare,
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  activePage: string;
  onPageChange: (page: string) => void;
}

const navigation = [
  { name: "Tổng quan", icon: LayoutDashboard, id: "overview" },
  { name: "Đơn hàng", icon: ShoppingCart, id: "orders" },
  { name: "Quà tặng", icon: Gift, id: "gifts" },
  { name: "Thẻ NFC", icon: Wifi, id: "nfc" },
  { name: "Mẫu thiết kế", icon: Layers, id: "templates" },
  { name: "Khách hàng", icon: Users, id: "customers" },
  { name: "Hỗ trợ trực tuyến", icon: MessageSquare, id: "support" },
  { name: "Thống kê", icon: BarChart3, id: "analytics" },
  { name: "Cài đặt", icon: Settings, id: "settings" },
];

export function DashboardLayout({
  children,
  activePage,
  onPageChange,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    { id: 1, title: "Đơn hàng mới đã nhận", time: "5 phút trước", unread: true },
    { id: 2, title: "Quà tặng #1234 đã mở", time: "1 giờ trước", unread: true },
    { id: 3, title: "Đã nhận thanh toán", time: "2 giờ trước", unread: false },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#F9FAFB" }}>
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{
          width: "280px",
          background: "white",
          borderRight: "1px solid #E5E7EB",
        }}
      >
        {/* Logo */}
        <div
          className="h-16 flex items-center justify-between px-6"
          style={{ borderBottom: "1px solid #E5E7EB" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)",
              }}
            >
              <Gift className="w-6 h-6 text-white" />
            </div>
            <span
              style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827" }}
            >
              WEMO
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                style={{
                  background: isActive
                    ? "rgba(232, 180, 168, 0.1)"
                    : "transparent",
                  color: isActive ? "#E8B4A8" : "#6B7280",
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            );
          })}

          {/* Back to Website */}
          <button
            onClick={() => {
              window.location.hash = "";
              window.location.reload();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mt-4"
            style={{
              background: "transparent",
              color: "#6B7280",
              fontWeight: 500,
              borderTop: "1px solid #E5E7EB",
              paddingTop: "16px",
            }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Quay lại Trang chủ</span>
          </button>
        </nav>

        {/* User section */}
        <div
          className="absolute bottom-0 left-0 right-0 p-4"
          style={{ borderTop: "1px solid #E5E7EB" }}
        >
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "#E8B4A8" }}
              >
                <span style={{ color: "white", fontWeight: 600 }}>QT</span>
              </div>
              <div className="flex-1 text-left">
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#111827",
                  }}
                >
                  Quản trị viên
                </div>
                <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                  admin@wemo.vn
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* User menu dropdown */}
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-full left-0 right-0 mb-2 rounded-xl shadow-xl overflow-hidden"
                  style={{
                    background: "white",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                    <User className="w-4 h-4 text-gray-500" />
                    <span style={{ fontSize: "0.875rem", color: "#374151" }}>
                      Tài khoản
                    </span>
                  </button>
                  <button 
                    onClick={() => {
                      localStorage.removeItem("adminToken");
                      window.location.reload();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-gray-500" />
                    <span style={{ fontSize: "0.875rem", color: "#374151" }}>
                      Đăng xuất
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-[280px]">
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 h-16 flex items-center justify-between px-6"
          style={{
            background: "white",
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search */}
            <div className="relative hidden md:block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "#9CA3AF" }}
              />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-80 pl-10 pr-4 py-2 rounded-xl outline-none transition-all"
                style={{
                  background: "#F3F4F6",
                  border: "1px solid transparent",
                  color: "#111827",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#E8B4A8";
                  e.target.style.background = "white";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "transparent";
                  e.target.style.background = "#F3F4F6";
                }}
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-gray-600" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <div
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ background: "#EF4444" }}
                />
              </button>

              {/* Notifications dropdown */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-80 rounded-xl shadow-xl overflow-hidden"
                    style={{
                      background: "white",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <div
                      className="p-4"
                      style={{ borderBottom: "1px solid #E5E7EB" }}
                    >
                      <div
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: "#111827",
                        }}
                      >
                        Thông báo
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                          style={{
                            borderBottom: "1px solid #F3F4F6",
                            background: notif.unread
                              ? "rgba(232, 180, 168, 0.05)"
                              : "transparent",
                          }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div
                                style={{
                                  fontSize: "0.875rem",
                                  color: "#111827",
                                }}
                              >
                                {notif.title}
                              </div>
                              <div
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#6B7280",
                                  marginTop: "4px",
                                }}
                              >
                                {notif.time}
                              </div>
                            </div>
                            {notif.unread && (
                              <div
                                className="w-2 h-2 rounded-full mt-1"
                                style={{ background: "#E8B4A8" }}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
