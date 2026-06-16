import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Search,
  Mail,
  DollarSign,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { adminFetch } from "../../utils/api";

interface Customer {
  name: string;
  email: string;
  totalOrders: number;
  totalSpend: number;
  lastActive: string;
}

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    adminFetch("/api/customers")
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalCustomers: customers.length,
    totalOrders: customers.reduce((sum, c) => sum + c.totalOrders, 0),
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpend, 0),
    avgSpend:
      customers.length > 0
        ? Math.round(
            customers.reduce((sum, c) => sum + c.totalSpend, 0) /
              customers.length
          )
        : 0,
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#111827" }}>
          Quản lý Khách hàng
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#6B7280", marginTop: "4px" }}>
          Quản lý tài khoản khách hàng và theo dõi hành vi sử dụng
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Tổng khách hàng",
            value: stats.totalCustomers,
            color: "#E8B4A8",
          },
          { label: "Đơn hàng hoạt động", value: stats.totalOrders, color: "#3B82F6" },
          { label: "Tổng doanh thu", value: `${stats.totalRevenue.toLocaleString()}đ`, color: "#10B981" },
          { label: "Chi tiêu trung bình", value: `${stats.avgSpend.toLocaleString()}đ`, color: "#F59E0B" },
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
            <div
              style={{
                fontSize: "0.75rem",
                color: "#6B7280",
                marginBottom: "8px",
              }}
            >
              {stat.label}
            </div>
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                color: stat.color,
              }}
            >
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search */}
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
            placeholder="Tìm kiếm khách hàng theo tên hoặc email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg outline-none text-sm bg-stone-50"
            style={{
              border: "1px solid #E5E7EB",
              color: "#111827",
            }}
          />
        </div>
      </div>

      {/* Customers grid */}
      {loading ? (
        <div className="p-12 text-center text-stone-400 text-xs font-bold flex flex-col items-center gap-2">
          <Sparkles className="w-6 h-6 animate-pulse text-[#E8B4A8]" />
          Đang nạp danh sách khách hàng...
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="p-12 text-center text-stone-400 text-xs font-bold">
          Không tìm thấy khách hàng nào.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer, index) => (
            <motion.div
              key={customer.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              style={{
                background: "white",
                border: "1px solid #E5E7EB",
              }}
            >
              {/* Avatar and name */}
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "#E8B4A8",
                    color: "white",
                    fontSize: "1.125rem",
                    fontWeight: 600,
                  }}
                >
                  {customer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "#111827",
                    }}
                  >
                    {customer.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#6B7280",
                      marginTop: "2px",
                    }}
                  >
                    Hoạt động cuối: {new Date(customer.lastActive).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#374151",
                    }}
                  >
                    {customer.email}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div
                className="grid grid-cols-2 gap-3 pt-4"
                style={{ borderTop: "1px solid #E5E7EB" }}
              >
                <div
                  className="text-center py-2 rounded-lg"
                  style={{ background: "#F9FAFB" }}
                >
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <ShoppingBag
                      className="w-3.5 h-3.5 text-[#E8B4A8]"
                    />
                    <span
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        color: "#E8B4A8",
                      }}
                    >
                      {customer.totalOrders}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "#6B7280" }}>
                    Đơn Hàng
                  </div>
                </div>
                <div
                  className="text-center py-2 rounded-lg"
                  style={{ background: "#F9FAFB" }}
                >
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <DollarSign
                      className="w-3.5 h-3.5 text-[#10B981]"
                    />
                    <span
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        color: "#10B981",
                      }}
                    >
                      {customer.totalSpend.toLocaleString()}đ
                    </span>
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "#6B7280" }}>
                    Doanh Chi
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
