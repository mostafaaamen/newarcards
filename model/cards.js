import mongoose from "mongoose";
let CardsSchema = new mongoose.Schema({
  price: {
    type: Number,
    require: true,
  },
  img: {
    type: String,
    require: true,
    },
    title: {
    type: String,
    required:true
  }
});
export const Card = mongoose.model("card", CardsSchema);
