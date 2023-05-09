import mongoose from "mongoose";
let OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  cards: [],
  email: String,
  address: [],
  status: {
    type: String,
    default: "Pending",
  },
  
  date: {
    type: Date,
    default: Date.now,
  },
});

export const Order = mongoose.model("order", OrderSchema);
