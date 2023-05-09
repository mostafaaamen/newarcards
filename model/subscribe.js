import mongoose from "mongoose";
let subscribeSchema = new mongoose.Schema({
  price: {
    type: Number,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  month: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
export const Subscribe = mongoose.model("subscribe", subscribeSchema);
