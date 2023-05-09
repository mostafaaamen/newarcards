import mongoose from "mongoose";
let ContactSchema = new mongoose.Schema({
  email: {
    type: Number,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  about: {
    type: String,
    required: true,
  },
});
export const Contact = mongoose.model("contact", ContactSchema);
