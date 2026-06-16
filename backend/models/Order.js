const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  product: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "processing", "completed", "cancelled"], default: "pending" },
  paymentStatus: { type: String, enum: ["paid", "unpaid", "refunded"], default: "unpaid" },
  createdDate: { type: String, default: () => new Date().toISOString().split("T")[0] },
});

module.exports = mongoose.model("Order", OrderSchema);
