require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { initStorage, writeJsonFile } = require("./utils/storage");

const MONGO_URI = process.env.MONGO_URI;

const mockOrders = [
  {
    id: "ORD-1001",
    customerName: "Nguyễn Văn A",
    product: "Sinh Nhật Rực Rỡ",
    amount: 199000,
    status: "completed",
    paymentStatus: "paid",
    createdDate: "2026-06-01",
  },
  {
    id: "ORD-1002",
    customerName: "Trần Thị B",
    product: "Ký Ức Lãng Mạn",
    amount: 250000,
    status: "processing",
    paymentStatus: "paid",
    createdDate: "2026-06-05",
  },
  {
    id: "ORD-1003",
    customerName: "Lê Văn C",
    product: "Dòng Thời Gian Kỷ Niệm",
    amount: 350000,
    status: "pending",
    paymentStatus: "unpaid",
    createdDate: "2026-06-12",
  },
  {
    id: "ORD-1004",
    customerName: "Phạm Hồng D",
    product: "Giáng Sinh Diệu Kỳ",
    amount: 299000,
    status: "completed",
    paymentStatus: "paid",
    createdDate: "2026-06-14",
  },
  {
    id: "ORD-1005",
    customerName: "Đỗ Gia Bảo",
    product: "Chào Đón Em Bé",
    amount: 199000,
    status: "cancelled",
    paymentStatus: "refunded",
    createdDate: "2026-06-15",
  },
];

const mockGifts = [
  {
    id: "g1b2c3",
    templateId: "sinh-nhat-party",
    photos: ["https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80"],
    hasVideo: false,
    hasVoice: false,
    recipientName: "Nguyễn Văn A",
    title: "Tiệc Đêm Sôi Động",
    message: "Chúc mừng sinh nhật tuổi 20 rực rỡ nhất nhé bạn tôi!",
    music: "birthday",
    orderId: "ORD-1001",
    views: 12,
    createdAt: "2026-06-02T10:00:00.000Z",
  },
  {
    id: "l5v6r7",
    templateId: "love-romantic",
    photos: ["https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80"],
    hasVideo: true,
    hasVoice: false,
    recipientName: "Trần Thị B",
    title: "Mãi Yêu Thương",
    message: "Cảm ơn em vì đã đến bên anh, chúc mừng kỷ niệm 2 năm yêu nhau của chúng mình.",
    music: "romantic",
    orderId: "ORD-1002",
    views: 45,
    createdAt: "2026-06-06T15:30:00.000Z",
  },
];

const mockNFC = [
  {
    id: "NFC-7001",
    uid: "04:A1:B2:C3:D4:E5:F6",
    status: "assigned",
    giftId: "g1b2c3",
    lastTapped: "2026-06-14 18:22",
  },
  {
    id: "NFC-7002",
    uid: "04:B2:C3:D4:E5:F6:A1",
    status: "assigned",
    giftId: "l5v6r7",
    lastTapped: "2026-06-15 09:11",
  },
  {
    id: "NFC-7003",
    uid: "04:C3:D4:E5:F6:A1:B2",
    status: "unassigned",
    giftId: "",
    lastTapped: "",
  },
];

const mockMessages = [
  {
    sessionId: "Session-112233",
    sender: "user",
    text: "Xin chào, tôi muốn hỏi cách liên kết chip NFC với thiệp?",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    sessionId: "Session-112233",
    sender: "admin",
    text: "Chào bạn! Sau khi thiết kế xong thiệp ở Bước 4, bạn bấm 'Gắn Chip NFC' và chạm mặt sau điện thoại vào thẻ WEMO để lưu liên kết nhé.",
    timestamp: new Date(Date.now() - 3600000 * 1.9).toISOString(),
  },
  {
    sessionId: "Session-112233",
    sender: "user",
    text: "Vâng mình cảm ơn, mình làm được rồi ạ!",
    timestamp: new Date(Date.now() - 3600000 * 1.8).toISOString(),
  },
];

const seedJSON = () => {
  console.log("Seeding Local JSON Database...");
  initStorage();
  writeJsonFile("orders.json", mockOrders);
  writeJsonFile("gifts.json", mockGifts);
  writeJsonFile("nfc.json", mockNFC);
  writeJsonFile("messages.json", mockMessages);
  console.log("Seeding completed successfully for JSON files!");
};

const seedMongo = async () => {
  console.log("Seeding MongoDB Atlas Database...");
  try {
    await mongoose.connect(MONGO_URI);
    
    // Dynamically load models
    const Gift = require("./models/Gift");
    const Order = require("./models/Order");
    const NFC = require("./models/NFC");
    const Message = require("./models/Message");

    // Clean existing tables
    await Gift.deleteMany({});
    await Order.deleteMany({});
    await NFC.deleteMany({});
    await Message.deleteMany({});

    // Insert seeds
    await Order.insertMany(mockOrders);
    await Gift.insertMany(mockGifts);
    await NFC.insertMany(mockNFC);
    await Message.insertMany(mockMessages);

    console.log("Seeding completed successfully for MongoDB!");
    await mongoose.disconnect();
  } catch (err) {
    console.error("Error seeding MongoDB:", err);
  }
};

const run = async () => {
  if (MONGO_URI) {
    await seedMongo();
  } else {
    seedJSON();
  }
};

run();
