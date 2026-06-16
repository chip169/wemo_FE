import { motion } from "motion/react";
import { Save, Globe, DollarSign, Database, Mail, Share2 } from "lucide-react";

export function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#111827" }}>
          Cài đặt
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#6B7280", marginTop: "4px" }}>
          Cấu hình các tùy chọn cho bảng điều khiển WEMO
        </p>
      </div>

      {/* Website Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-6"
        style={{
          background: "white",
          border: "1px solid #E5E7EB",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(232, 180, 168, 0.1)" }}
          >
            <Globe className="w-5 h-5" style={{ color: "#E8B4A8" }} />
          </div>
          <h3
            style={{ fontSize: "1.125rem", fontWeight: 600, color: "#111827" }}
          >
            Cấu hình Website
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Tên Website
            </label>
            <input
              type="text"
              defaultValue="WEMO - Nền tảng Quà tặng Kỹ thuật số"
              className="w-full px-4 py-2 rounded-lg outline-none text-xs bg-stone-50"
              style={{
                border: "1px solid #E5E7EB",
                color: "#111827",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Đường dẫn Website URL
            </label>
            <input
              type="text"
              defaultValue="https://wemo.vn"
              className="w-full px-4 py-2 rounded-lg outline-none text-xs bg-stone-50"
              style={{
                border: "1px solid #E5E7EB",
                color: "#111827",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Mô tả Meta Description
            </label>
            <textarea
              rows={3}
              defaultValue="Tạo quà tặng kỹ thuật số cảm xúc với công nghệ chip NFC. Biến những kỷ niệm tuyệt đẹp thành trải nghiệm tương tác trực quan."
              className="w-full px-4 py-2 rounded-lg outline-none resize-none text-xs bg-stone-50"
              style={{
                border: "1px solid #E5E7EB",
                color: "#111827",
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Pricing Plans */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl p-6"
        style={{
          background: "white",
          border: "1px solid #E5E7EB",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(16, 185, 129, 0.1)" }}
          >
            <DollarSign className="w-5 h-5" style={{ color: "#10B981" }} />
          </div>
          <h3
            style={{ fontSize: "1.125rem", fontWeight: 600, color: "#111827" }}
          >
            Gói Dịch Vụ & Bảng Giá
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Cơ bản", price: "99.000đ" },
            { name: "Cao cấp", price: "199.000đ" },
            { name: "Doanh nghiệp", price: "Liên hệ" },
          ].map((plan, index) => (
            <div
              key={index}
              className="p-4 rounded-lg"
              style={{ border: "1px solid #E5E7EB" }}
            >
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#6B7280",
                  marginBottom: "4px",
                }}
              >
                {plan.name}
              </div>
              <input
                type="text"
                defaultValue={plan.price}
                className="w-full px-3 py-2 rounded-lg outline-none text-xs bg-stone-50 font-bold"
                style={{
                  border: "1px solid #E5E7EB",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#111827",
                }}
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Storage Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl p-6"
        style={{
          background: "white",
          border: "1px solid #E5E7EB",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(59, 130, 246, 0.1)" }}
          >
            <Database className="w-5 h-5" style={{ color: "#3B82F6" }} />
          </div>
          <h3
            style={{ fontSize: "1.125rem", fontWeight: 600, color: "#111827" }}
          >
            Cấu hình Dung lượng Lưu trữ
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <div
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#111827",
                }}
              >
                Dung lượng tệp tối đa (MB)
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#6B7280",
                  marginTop: "2px",
                }}
              >
                Kích thước tệp tải lên tối đa được cho phép
              </div>
            </div>
            <input
              type="number"
              defaultValue="50"
              className="w-24 px-3 py-2 rounded-lg outline-none text-right text-xs bg-stone-55"
              style={{
                border: "1px solid #E5E7EB",
                color: "#111827",
              }}
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <div
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#111827",
                }}
              >
                Giới hạn dung lượng lưu trữ (GB)
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#6B7280",
                  marginTop: "2px",
                }}
              >
                Tổng dung lượng lưu trữ cho mỗi người dùng
              </div>
            </div>
            <input
              type="number"
              defaultValue="5"
              className="w-24 px-3 py-2 rounded-lg outline-none text-right text-xs bg-stone-55"
              style={{
                border: "1px solid #E5E7EB",
                color: "#111827",
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Email Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl p-6"
        style={{
          background: "white",
          border: "1px solid #E5E7EB",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(245, 158, 11, 0.1)" }}
          >
            <Mail className="w-5 h-5" style={{ color: "#F59E0B" }} />
          </div>
          <h3
            style={{ fontSize: "1.125rem", fontWeight: 600, color: "#111827" }}
          >
            Thông báo qua Email
          </h3>
        </div>

        <div className="space-y-4">
          {[
            {
              label: "Xác nhận đơn hàng",
              description: "Gửi email xác nhận ngay khi đơn hàng được tạo",
            },
            {
              label: "Quà tặng đã giao",
              description: "Thông báo khi quà tặng kỹ thuật số đã sẵn sàng",
            },
            {
              label: "Quà tặng đã mở",
              description: "Thông báo khi người nhận thực hiện mở thiệp",
            },
            {
              label: "Đã nhận thanh toán",
              description: "Xác nhận giao dịch thanh toán thành công",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3"
              style={{ borderBottom: index < 3 ? "1px solid #F3F4F6" : "none" }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#111827",
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#6B7280",
                    marginTop: "2px",
                  }}
                >
                  {item.description}
                </div>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only peer"
                />
                <div
                  className="w-12 h-6 rounded-full peer-checked:bg-[#E8B4A8] transition-colors cursor-pointer"
                  style={{ background: "#D1D5DB" }}
                />
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6" />
              </label>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Social Media Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl p-6"
        style={{
          background: "white",
          border: "1px solid #E5E7EB",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(139, 92, 246, 0.1)" }}
          >
            <Share2 className="w-5 h-5" style={{ color: "#8B5CF6" }} />
          </div>
          <h3
            style={{ fontSize: "1.125rem", fontWeight: 600, color: "#111827" }}
          >
            Liên kết Mạng xã hội
          </h3>
        </div>

        <div className="space-y-4">
          {["Instagram", "Twitter", "Facebook", "TikTok"].map(
            (platform, index) => (
              <div key={index}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  {platform}
                </label>
                <input
                  type="text"
                  placeholder={`https://${platform.toLowerCase()}.com/wemo`}
                  className="w-full px-4 py-2 rounded-lg outline-none text-xs bg-stone-50"
                  style={{
                    border: "1px solid #E5E7EB",
                    color: "#111827",
                  }}
                />
              </div>
            ),
          )}
        </div>
      </motion.div>

      {/* Save button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-end"
      >
        <button
          onClick={() => alert("Lưu tất cả cài đặt thành công!")}
          className="flex items-center gap-2 px-6 py-3 rounded-xl cursor-pointer"
          style={{
            background: "#E8B4A8",
            color: "white",
            fontWeight: 600,
          }}
        >
          <Save className="w-5 h-5" />
          Lưu tất cả cấu hình
        </button>
      </motion.div>
    </div>
  );
}
