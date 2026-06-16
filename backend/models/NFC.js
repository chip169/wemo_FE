const mongoose = require("mongoose");

const NFCSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  uid: { type: String, required: true, unique: true },
  status: { type: String, enum: ["unassigned", "assigned", "inactive"], default: "unassigned" },
  giftId: { type: String, default: "" },
  lastTapped: { type: String, default: "" },
});

module.exports = mongoose.model("NFC", NFCSchema);
