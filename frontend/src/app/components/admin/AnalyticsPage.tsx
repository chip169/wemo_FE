import { motion } from "motion/react";
import { TrendingUp, Eye, Wifi, Gift, DollarSign } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const revenueAnalytics = [
  { month: "Th1", revenue: 4200, gifts: 234, nfc: 198 },
  { month: "Th2", revenue: 5800, gifts: 312, nfc: 267 },
  { month: "Th3", revenue: 7200, gifts: 398, nfc: 345 },
  { month: "Th4", revenue: 6500, gifts: 356, nfc: 312 },
  { month: "Th5", revenue: 8900, gifts: 487, nfc: 423 },
  { month: "Th6", revenue: 10200, gifts: 532, nfc: 489 },
];

const giftOpenRate = [
  { day: "T2", opened: 89, delivered: 102 },
  { day: "T3", opened: 95, delivered: 108 },
  { day: "T4", opened: 112, delivered: 125 },
  { day: "T5", opened: 87, delivered: 98 },
  { day: "T6", opened: 134, delivered: 145 },
  { day: "T7", opened: 156, delivered: 167 },
  { day: "CN", opened: 143, delivered: 152 },
];

const topGifts = [
  { name: "GIFT-2001", views: 245, recipient: "Nguyễn Hải Anh" },
  { name: "GIFT-2012", views: 198, recipient: "Trần Minh Tâm" },
  { name: "GIFT-2023", views: 187, recipient: "Lê Thị Lan" },
  { name: "GIFT-2034", views: 156, recipient: "Phạm Văn Minh" },
  { name: "GIFT-2045", views: 134, recipient: "Hoàng Ngọc Ánh" },
];

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#111827" }}>
          Thống kê & Phân tích
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#6B7280", marginTop: "4px" }}>
          Theo dõi các chỉ số hiệu suất hoạt động hệ thống
        </p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Tổng doanh thu",
            value: "42.600.000đ",
            change: "+18.2%",
            icon: DollarSign,
            color: "#10B981",
          },
          {
            label: "Tổng quà tặng",
            value: "2.319",
            change: "+24.5%",
            icon: Gift,
            color: "#E8B4A8",
          },
          {
            label: "Lượt xem trung bình/Quà",
            value: "8.3 Lượt",
            change: "+5.7%",
            icon: Eye,
            color: "#3B82F6",
          },
          {
            label: "Kích hoạt chip NFC",
            value: "89%",
            change: "+2.3%",
            icon: Wifi,
            color: "#8B5CF6",
          },
        ].map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-xl p-6"
            style={{
              background: "white",
              border: "1px solid #E5E7EB",
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: `${metric.color}15`,
                }}
              >
                <metric.icon
                  className="w-6 h-6"
                  style={{ color: metric.color }}
                />
              </div>
              <div
                className="flex items-center gap-1 px-2 py-1 rounded-md"
                style={{
                  background: "#DCFCE7",
                  color: "#16A34A",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                <TrendingUp className="w-3 h-3" />
                {metric.change}
              </div>
            </div>
            <div
              style={{
                fontSize: "1.875rem",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {metric.value}
            </div>
            <div
              style={{
                fontSize: "0.875rem",
                color: "#6B7280",
                marginTop: "4px",
              }}
            >
              {metric.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Analytics */}
      <div
        className="rounded-xl p-6"
        style={{
          background: "white",
          border: "1px solid #E5E7EB",
        }}
      >
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "#111827",
            marginBottom: "16px",
          }}
        >
          Phân tích Doanh thu & Quà tặng
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={revenueAnalytics}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E8B4A8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#E8B4A8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="month"
              stroke="#6B7280"
              style={{ fontSize: "0.75rem" }}
            />
            <YAxis stroke="#6B7280" style={{ fontSize: "0.75rem" }} />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                fontSize: "0.875rem",
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#E8B4A8"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Gift Open Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="rounded-xl p-6"
          style={{
            background: "white",
            border: "1px solid #E5E7EB",
          }}
        >
          <h3
            style={{
              fontSize: "1.125rem",
              fontWeight: 600,
              color: "#111827",
              marginBottom: "16px",
            }}
          >
            Tỷ lệ mở thiệp quà tặng (7 ngày qua)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={giftOpenRate}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="day"
                stroke="#6B7280"
                style={{ fontSize: "0.75rem" }}
              />
              <YAxis stroke="#6B7280" style={{ fontSize: "0.75rem" }} />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                }}
              />
              <Bar dataKey="delivered" name="Đã phát" fill="#DBEAFE" radius={[8, 8, 0, 0]} />
              <Bar dataKey="opened" name="Đã xem" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Most Viewed Gifts */}
        <div
          className="rounded-xl p-6"
          style={{
            background: "white",
            border: "1px solid #E5E7EB",
          }}
        >
          <h3
            style={{
              fontSize: "1.125rem",
              fontWeight: 600,
              color: "#111827",
              marginBottom: "16px",
            }}
          >
            Thiệp quà tặng xem nhiều nhất
          </h3>
          <div className="space-y-3">
            {topGifts.map((gift, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `rgba(232, 180, 168, ${0.3 - index * 0.05})`,
                    color: "#E8B4A8",
                    fontWeight: 700,
                  }}
                >
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#111827",
                    }}
                  >
                    {gift.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#6B7280",
                      marginTop: "2px",
                    }}
                  >
                    {gift.recipient}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" style={{ color: "#6B7280" }} />
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#111827",
                    }}
                  >
                    {gift.views}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NFC Activation Rate */}
      <div
        className="rounded-xl p-6"
        style={{
          background: "white",
          border: "1px solid #E5E7EB",
        }}
      >
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "#111827",
            marginBottom: "16px",
          }}
        >
          Xu hướng kích hoạt NFC
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueAnalytics}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="month"
              stroke="#6B7280"
              style={{ fontSize: "0.75rem" }}
            />
            <YAxis stroke="#6B7280" style={{ fontSize: "0.75rem" }} />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                fontSize: "0.875rem",
              }}
            />
            <Line
              type="monotone"
              dataKey="nfc"
              stroke="#8B5CF6"
              strokeWidth={3}
              dot={{ fill: "#8B5CF6", r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
