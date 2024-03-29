import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
  user: {
    type: String,
  },
  message: {
    type: String,
  },
});

export const MessageModel = mongoose.model("messages", messageSchema);
