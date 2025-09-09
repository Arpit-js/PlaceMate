// models/Application.js
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  package: { type: String },
  drives: { type: Number },
  deadline: { type: Date },
  topics: { type: [String] },
  status: { type: String, enum: ["upcoming", "ongoing", "completed"], default: "upcoming" },
}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);
