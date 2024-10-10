// models/tool.js
const mongoose = require("mongoose");

const ToolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  quarter: {
    type: Number,
    required: true,
  },
  yearly: {
    type: Number,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Tools", ToolSchema);
