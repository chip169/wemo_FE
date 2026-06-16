import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";

const mockTemplates = [
  {
    id: "TPL-001",
    name: "Sinh Nhật Rực Rỡ",
    category: "celebration",
    categoryLabel: "Sinh nhật & Lễ hội",
    usageCount: 435,
    status: "active",
    preview:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400",
  },
  {
    id: "TPL-002",
    name: "Kỷ Ức Lãng Mạn",
    category: "romance",
    categoryLabel: "Tình yêu & Lãng mạn",
    usageCount: 378,
    status: "active",
    preview:
      "https://images.unsplash.com/photo-1513279922550-250c2129b13a?w=400",
  },
  {
    id: "TPL-003",
    name: "Giáng Sinh Ấm Áp",
    category: "holiday",
    categoryLabel: "Ngày lễ & Giáng Sinh",
    usageCount: 289,
    status: "active",
    preview:
      "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=400",
  },
  {
    id: "TPL-004",
    name: "Hành Trình Kỷ Niệm",
    category: "milestone",
    categoryLabel: "Kỷ niệm",
    usageCount: 245,
    status: "active",
    preview:
      "https://images.unsplash.com/photo-1523521803700-b3bcaeab0150?w=400",
  },
  {
    id: "TPL-005",
    name: "Ngày Tốt Nghiệp",
    category: "achievement",
    categoryLabel: "Thành tựu",
    usageCount: 187,
    status: "archived",
    preview:
      "https://images.unsplash.com/photo-1623461487986-9400110de28e?w=400",
  },
];

export function TemplatesPage() {
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredTemplates = mockTemplates.filter((template) => {
    return (
      categoryFilter === "all" ||
      template.category.toLowerCase() === categoryFilter
    );
  });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            style={{ fontSize: "1.875rem", fontWeight: 700, color: "#111827" }}
          >
            Quản lý Mẫu thiết kế
          </h1>
          <p
            style={{ fontSize: "0.875rem", color: "#6B7280", marginTop: "4px" }}
          >
            Quản lý các mẫu thiệp quà tặng điện tử
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{
            background: "#E8B4A8",
            color: "white",
            fontWeight: 600,
          }}
        >
          <Plus className="w-4 h-4" />
          Tạo Mẫu thiết kế
        </motion.button>
      </div>

      {/* Filter */}
      <div
        className="rounded-xl p-6"
        style={{
          background: "white",
          border: "1px solid #E5E7EB",
        }}
      >
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 rounded-lg outline-none text-xs bg-stone-50 text-stone-700 font-semibold"
          style={{
            border: "1px solid #E5E7EB",
          }}
        >
          <option value="all">Tất cả danh mục</option>
          <option value="celebration">Sinh nhật & Lễ hội</option>
          <option value="romance">Tình yêu & Lãng mạn</option>
          <option value="holiday">Ngày lễ & Giáng Sinh</option>
          <option value="milestone">Kỷ niệm</option>
          <option value="achievement">Thành tựu</option>
        </select>
      </div>

      {/* Templates grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            style={{
              background: "white",
              border: "1px solid #E5E7EB",
            }}
          >
            {/* Preview */}
            <div
              className="relative h-48 overflow-hidden"
              style={{ background: "#F3F4F6" }}
            >
              <img
                src={template.preview}
                alt={template.name}
                className="w-full h-full object-cover"
              />
              {template.status === "archived" && (
                <div
                  className="absolute top-3 right-3 px-3 py-1 rounded-full"
                  style={{
                    background: "#6B7280",
                    color: "white",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  Đã lưu trữ
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: 600,
                      color: "#111827",
                    }}
                  >
                    {template.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#6B7280",
                      marginTop: "4px",
                    }}
                  >
                    {template.categoryLabel}
                  </p>
                </div>
              </div>

              <div
                className="flex items-center gap-2 mb-4 pb-4"
                style={{ borderBottom: "1px solid #E5E7EB" }}
              >
                <div
                  className="flex-1 text-center py-2 px-3 rounded-lg"
                  style={{ background: "#F9FAFB" }}
                >
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "#E8B4A8",
                    }}
                  >
                    {template.usageCount}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#6B7280",
                      marginTop: "2px",
                    }}
                  >
                    Lượt dùng
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  style={{
                    border: "1px solid #E5E7EB",
                    color: "#374151",
                    fontSize: "0.875rem",
                  }}
                >
                  <Eye className="w-4 h-4" />
                  Xem thử
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  style={{
                    border: "1px solid #E5E7EB",
                    color: "#374151",
                    fontSize: "0.875rem",
                  }}
                >
                  <Edit className="w-4 h-4" />
                  Sửa
                </button>
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  style={{
                    border: "1px solid #E5E7EB",
                    color: "#DC2626",
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
