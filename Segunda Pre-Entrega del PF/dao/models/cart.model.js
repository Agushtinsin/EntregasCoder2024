import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
  products: {
    type: [
      {
        item: String,
        quantity: Number,
      },
    ],
    default: [],
  },
});

export const CartModel = mongoose.model("cart", cartSchema);
