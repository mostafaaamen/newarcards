import mongoose from "mongoose";
let TransacrionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
    data: {
    type: {},
    required:true
    },
    cards: {
        type: [],
        required :true
    },
  date: {
    type: Date,
    default: Date.now,
  },
});

export const TransAcrion = mongoose.model("transaction", TransacrionSchema);
