import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Wifi,
  CheckCircle,
  Clock,
  Trash2,
  Sparkles,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import { adminFetch } from "../../utils/api";

interface NFCTag {
  id: string;
  uid: string;
  status: "unassigned" | "assigned" | "inactive";
  giftId: string;
  lastTapped: string;
}

const statusConfig = {
  unassigned: {
    bg: "#DCFCE7",
    text: "#16A34A",
    label: "Có sẵn",
    icon: CheckCircle,
  },
  assigned: {
    bg: "#DBEAFE",
    text: "#2563EB",
    label: "Đã gán",
    icon: Clock,
  },
  inactive: {
    bg: "#F3F4F6",
    text: "#6B7280",
    label: "Vô hiệu hóa",
    icon: Wifi,
  },
};

export function NFCPage() {
  const [nfcTags, setNfcTags] = useState<NFCTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Create Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formUid, setFormUid] = useState("");
  const [formStatus, setFormStatus] = useState<"unassigned" | "assigned" | "inactive">("unassigned");
  const [formGiftId, setFormGiftId] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchNFCTags = () => {
    setLoading(true);
    adminFetch("/api/nfc")
      .then((res) => res.json())
      .then((data) => {
        setNfcTags(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNFCTags();
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUid.trim()) return;

    setCreating(true);
    const body = {
      uid: formUid.trim(),
      status: formStatus,
      giftId: formGiftId.trim(),
    };

    adminFetch("/api/nfc", {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        setCreating(false);
        if (data.error) {
          alert(data.error);
        } else {
          alert(`Đã thêm thẻ NFC thành công (ID: ${data.id})`);
          setIsCreateOpen(false);
          setFormUid("");
          setFormGiftId("");
          setFormStatus("unassigned");
          fetchNFCTags();
        }
      })
      .catch((err) => {
        console.error(err);
        setCreating(false);
        alert("Lỗi hệ thống khi thêm thẻ NFC.");
      });
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa chip NFC ${id}?`)) {
      adminFetch(`/api/nfc/${id}`, { method: "DELETE" })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message || "Xóa thành công.");
          fetchNFCTags();
        })
        .catch(console.error);
    }
  };

  const filteredTags = nfcTags.filter((tag) => {
    const matchesSearch =
      tag.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.giftId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || tag.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: nfcTags.length,
    available: nfcTags.filter((t) => t.status === "unassigned").length,
    assigned: nfcTags.filter((t) => t.status === "assigned").length,
    inactive: nfcTags.filter((t) => t.status === "inactive").length,
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#111827" }}>
            Quản lý Thẻ NFC
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#6B7280", marginTop: "4px" }}>
            Quản lý và theo dõi thông tin thẻ chip NFC
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer shadow border-0 text-white"
          style={{
            background: "#E8B4A8",
            fontWeight: 600,
          }}
        >
          <Plus className="w-4 h-4" />
          Thêm thẻ NFC
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Tổng số thẻ", value: stats.total, color: "#E8B4A8" },
          { label: "Có sẵn", value: stats.available, color: "#16A34A" },
          { label: "Đã gán", value: stats.assigned, color: "#2563EB" },
          { label: "Vô hiệu hóa", value: stats.inactive, color: "#6B7280" },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-xl p-6 shadow-sm"
            style={{
              background: "white",
              border: "1px solid #E5E7EB",
            }}
          >
            <div style={{ fontSize: "0.75rem", color: "#6B7280", marginBottom: "8px" }}>
              {stat.label}
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 700, color: stat.color }}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="rounded-xl p-6"
        style={{
          background: "white",
          border: "1px solid #E5E7EB",
        }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "#9CA3AF" }}
            />
            <input
              type="text"
              placeholder="Tìm kiếm theo ID hoặc UID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg outline-none text-sm bg-stone-50"
              style={{
                border: "1px solid #E5E7EB",
                color: "#111827",
              }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg outline-none text-xs bg-stone-50 text-stone-700 font-semibold cursor-pointer"
            style={{
              border: "1px solid #E5E7EB",
            }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="unassigned">Có sẵn</option>
            <option value="assigned">Đã gán</option>
            <option value="inactive">Vô hiệu hóa</option>
          </select>
        </div>
      </div>

      {/* NFC Table */}
      <div
        className="rounded-xl overflow-hidden shadow-sm"
        style={{
          background: "white",
          border: "1px solid #E5E7EB",
        }}
      >
        {loading ? (
          <div className="p-12 text-center text-stone-400 text-xs font-bold flex flex-col items-center gap-2">
            <Sparkles className="w-6 h-6 animate-pulse text-[#E8B4A8]" />
            Đang tải dữ liệu thẻ NFC...
          </div>
        ) : filteredTags.length === 0 ? (
          <div className="p-12 text-center text-stone-400 text-xs font-bold">
            Không tìm thấy thẻ NFC nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead
                style={{
                  background: "#F9FAFB",
                  borderBottom: "1px solid #E5E7EB",
                }}
              >
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                    Mã thẻ NFC
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                    UID Thẻ NFC
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                    Mã Quà Liên Kết
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                    Trạng Thái
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                    Lần Chạm Cuối
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTags.map((tag, index) => {
                  const statusInfo = statusConfig[tag.status] || statusConfig.unassigned;
                  const StatusIcon = statusInfo.icon;
                  return (
                    <motion.tr
                      key={tag.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-gray-50 transition-colors"
                      style={{
                        borderBottom: "1px solid #F3F4F6",
                      }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Wifi className="w-4 h-4" style={{ color: "#E8B4A8" }} />
                          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#111827" }}>
                            {tag.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono text-stone-600">
                          {tag.uid}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {tag.giftId ? (
                          <span
                            className="text-xs font-mono font-bold text-[#E8B4A8] hover:underline cursor-pointer"
                            onClick={() => window.open(`/gift/${tag.giftId}`, "_blank")}
                          >
                            {tag.giftId}
                          </span>
                        ) : (
                          <span className="text-xs text-stone-400">Chưa liên kết</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold"
                          style={{
                            background: statusInfo.bg,
                            color: statusInfo.text,
                          }}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-stone-500">
                          {tag.lastTapped || "Chưa chạm"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(tag.id)}
                          className="p-1.5 hover:bg-rose-50 text-rose-500 rounded transition-colors cursor-pointer border-0 bg-transparent"
                          title="Xóa thẻ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create NFC Modal */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-stone-200 shadow-2xl p-6 w-full max-w-md relative"
            >
              <button
                onClick={() => setIsCreateOpen(false)}
                className="absolute top-4 right-4 p-1 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#E8B4A8]" />
                Thêm thẻ NFC mới
              </h3>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-550 uppercase tracking-wider mb-1.5">
                    Mã UID phần cứng thẻ *
                  </label>
                  <input
                    type="text"
                    value={formUid}
                    onChange={(e) => setFormUid(e.target.value)}
                    required
                    placeholder="Ví dụ: 04:A1:B2:C3:D4:E5:F6"
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-[#E8B4A8] bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-550 uppercase tracking-wider mb-1.5">
                    Trạng thái ban đầu *
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-[#E8B4A8] bg-stone-50"
                  >
                    <option value="unassigned">Có sẵn (unassigned)</option>
                    <option value="assigned">Đã gán (assigned)</option>
                    <option value="inactive">Vô hiệu hóa (inactive)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-550 uppercase tracking-wider mb-1.5">
                    Mã quà tặng liên kết (Tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={formGiftId}
                    onChange={(e) => setFormGiftId(e.target.value)}
                    placeholder="Nhập giftId nếu đã gán quà"
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-[#E8B4A8] bg-stone-50"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="flex-1 py-2 text-xs font-bold border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-xl transition-colors cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 py-2 text-xs font-bold bg-[#E8B4A8] hover:opacity-90 text-white rounded-xl transition-colors disabled:opacity-50 cursor-pointer shadow-md"
                  >
                    {creating ? "Đang thêm..." : "Thêm thẻ"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
