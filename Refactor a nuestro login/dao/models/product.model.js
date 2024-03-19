import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  stock: {
    type: Number,
    default: true,
  },
  category: {
    type: String,
    required: true,
  },
  thumbnails: {
    type: [String],
  },
});

export const ProductModel = mongoose.model("products", productSchema);
