const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["initiated", "pending", "completed", "failed"], // Add the allowed values here
    },
    currency: {
      type: String,
      enum: ["INR", "USD"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", ContactSchema);
