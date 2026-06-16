const mongoose = require("mongoose");

const GiftSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  templateId: { type: String, required: true },
  photos: [{ type: String }],
  hasVideo: { type: Boolean, default: false },
  hasVoice: { type: Boolean, default: false },
  recipientName: { type: String, required: true },
  title: { type: String },
  message: { type: String },
  music: { type: String, default: "none" },
  orderId: { type: String, required: true, index: true },
  views: { type: Number, default: 0 },
  createdAt: { type: String, default: () => new Date().toISOString() },
});

module.exports = mongoose.model("Gift", GiftSchema);
