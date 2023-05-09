import mongoose from "mongoose";
let TransacrionSubscriptionsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
    data: {
    type: {},
    required:true
    },
    subscribe: {
        type: {},
        required :true
    },
  date: {
    type: Date,
    default: Date.now,
  },
});

export const TransacrionSubscriptions = mongoose.model(
  "transactionSubscription",
  TransacrionSubscriptionsSchema
);
