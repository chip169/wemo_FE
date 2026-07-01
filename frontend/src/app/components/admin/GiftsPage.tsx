import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
} from "lucide-react";
import { adminFetch } from "../../utils/api";

interface Gift {
  id: string;
  recipientName: string;
  templateId: string;
  orderId: string;
  views: number;
  createdAt: string;
}

const statusColors = {
  published: { bg: "#DCFCE7", text: "#16A34A", label: "Đã tạo thiệp" },
  uncreated: { bg: "#FEF3C7", text: "#D97706", label: "Chưa tạo thiệp" },
};

export function GiftsPage() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  const [editRecipientName, setEditRecipientName] = useState("");
  const [editOrderId, setEditOrderId] = useState("");
  const [updating, setUpdating] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGift) return;

    setUpdating(true);
    adminFetch(`/api/gifts/${editingGift.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientName: editRecipientName,
        orderId: editOrderId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUpdating(false);
        if (data.error) {
          alert(data.error);
        } else {
          alert("Đã cập nhật quà tặng thành công.");
          setEditingGift(null);
          fetchGifts();
        }
      })
      .catch((err) => {
        console.error(err);
        setUpdating(false);
        alert("Lỗi hệ thống khi cập nhật quà tặng.");
      });
  };

  const fetchGifts = () => {
    setLoading(true);
    Promise.all([
      adminFetch("/api/gifts").then((res) => (res.ok ? res.json() : [])).catch(() => []),
      adminFetch("/api/orders").then((res) => (res.ok ? res.json() : [])).catch(() => []),
    ])
      .then(([giftsData, ordersData]) => {
        const giftsList = Array.isArray(giftsData) ? giftsData : [];
        const ordersList = Array.isArray(ordersData) ? ordersData : [];

        // Build map of orderIds that have created gifts
        const createdOrderIds = new Set(giftsList.map((g: any) => g.orderId).filter(Boolean));

        // Filter orders that don't have created gifts yet
        const uncreatedGifts = ordersList
          .filter((o: any) => o && o.id && !createdOrderIds.has(o.id))
          .map((o: any) => ({
            id: "-", 
            recipientName: `Chưa có (Đơn hàng: ${o.customerName || "Chưa rõ"})`,
            templateId: "-",
            orderId: o.id,
            views: 0,
            createdAt: o.createdDate || "",
            isPlaceholder: true,
          }));

        // Combine both
        const combined = [...giftsList, ...uncreatedGifts];
        setGifts(combined);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGifts();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa món quà ${id}?`)) {
      adminFetch(`/api/gifts/${id}`, { method: "DELETE" })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message || "Đã xóa thành công.");
          fetchGifts();
        })
        .catch(console.error);
    }
  };

  const filteredGifts = gifts.filter((gift) => {
    const recipient = gift.recipientName || "";
    const orderId = gift.orderId || "";
    const giftId = gift.id || "";
    return (
      recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      giftId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredGifts.length / itemsPerPage);
  const currentGifts = filteredGifts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            style={{ fontSize: "1.875rem", fontWeight: 700, color: "#111827" }}
          >
            Quản lý Quà tặng
          </h1>
          <p
            style={{ fontSize: "0.875rem", color: "#6B7280", marginTop: "4px" }}
          >
            Quản lý và theo dõi toàn bộ quà tặng điện tử
          </p>
        </div>
      </div>

      {/* Filters and search */}
      <div
        className="rounded-xl p-6"
        style={{
          background: "white",
          border: "1px solid #E5E7EB",
        }}
      >
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "#9CA3AF" }}
          />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã quà, mã đơn hàng hoặc tên người nhận..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg outline-none text-sm bg-stone-50"
            style={{
              border: "1px solid #E5E7EB",
              color: "#111827",
            }}
          />
        </div>
      </div>

      {/* Gifts table */}
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
            Đang nạp danh sách quà tặng...
          </div>
        ) : filteredGifts.length === 0 ? (
          <div className="p-12 text-center text-stone-400 text-xs font-bold">
            Không tìm thấy quà tặng nào.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead
                  style={{
                    background: "#F9FAFB",
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  <tr>
                    <th
                      className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider"
                    >
                      Mã quà tặng
                    </th>
                    <th
                      className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider"
                    >
                      Người Nhận
                    </th>
                    <th
                      className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider"
                    >
                      Mã Đơn Hàng
                    </th>
                    <th
                      className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider"
                    >
                      Mẫu Thiệp
                    </th>
                    <th
                      className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider"
                    >
                      Trạng Thái
                    </th>
                    <th
                      className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider"
                    >
                      Ngày Tạo
                    </th>
                    <th
                      className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider"
                    >
                      Lượt Xem
                    </th>
                    <th
                      className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider"
                    >
                      Hành Động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentGifts.map((gift, index) => (
                    <motion.tr
                      key={gift.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-gray-50 transition-colors"
                      style={{
                        borderBottom: "1px solid #F3F4F6",
                      }}
                    >
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono font-bold text-[#111827]">
                          {gift.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold text-[#374151]">
                          {gift.recipientName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono text-stone-500">
                          {gift.orderId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-stone-700">
                          {gift.templateId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{
                            background: gift.isPlaceholder ? statusColors.uncreated.bg : statusColors.published.bg,
                            color: gift.isPlaceholder ? statusColors.uncreated.text : statusColors.published.text,
                          }}
                        >
                          {gift.isPlaceholder ? statusColors.uncreated.label : statusColors.published.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-stone-500">
                          {gift.createdAt ? new Date(gift.createdAt).toLocaleDateString() : "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-[#111827]">
                          {gift.views}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {!gift.isPlaceholder ? (
                          <div className="flex items-center gap-2">
                            <a
                              href={`/gift/${gift.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 hover:bg-stone-100 rounded text-stone-600 transition-colors"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => {
                                setEditingGift(gift);
                                setEditRecipientName(gift.recipientName);
                                setEditOrderId(gift.orderId);
                              }}
                              className="p-1.5 hover:bg-amber-50 text-amber-600 rounded transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(gift.id)}
                              className="p-1.5 hover:bg-rose-50 text-rose-500 rounded transition-colors"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-stone-400 font-semibold italic">Chờ khách thiết kế</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{
                  borderTop: "1px solid #E5E7EB",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                  Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{" "}
                  {Math.min(currentPage * itemsPerPage, filteredGifts.length)}{" "}
                  trong số {filteredGifts.length} phần tử
                </div>
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className="w-8 h-8 rounded-lg text-xs transition-colors"
                      style={{
                        background:
                          currentPage === i + 1 ? "#E8B4A8" : "transparent",
                        color: currentPage === i + 1 ? "white" : "#6B7280",
                        fontWeight: currentPage === i + 1 ? 600 : 400,
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingGift && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-stone-200 shadow-2xl p-6 w-full max-w-md relative"
            >
              <button
                onClick={() => setEditingGift(null)}
                className="absolute top-4 right-4 p-1 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-bold text-stone-900 mb-4">
                Chỉnh sửa quà tặng (Mã: {editingGift.id})
              </h3>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                    Người Nhận
                  </label>
                  <input
                    type="text"
                    value={editRecipientName}
                    onChange={(e) => setEditRecipientName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-[#E8B4A8] bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                    Mã Đơn Hàng (orderId)
                  </label>
                  <input
                    type="text"
                    value={editOrderId}
                    onChange={(e) => setEditOrderId(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-[#E8B4A8] bg-stone-50"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingGift(null)}
                    className="flex-1 py-2 text-xs font-bold border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-xl transition-colors cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex-1 py-2 text-xs font-bold bg-[#E8B4A8] hover:opacity-90 text-white rounded-xl transition-colors disabled:opacity-50 cursor-pointer shadow-md"
                  >
                    {updating ? "Đang lưu..." : "Lưu thay đổi"}
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
