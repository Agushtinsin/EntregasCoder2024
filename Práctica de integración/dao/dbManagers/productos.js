import { ProductModel } from "../models/product.model.js";

class ProductManager {
  async addItem(item) {
    await ProductModel.create(item);
  }

  async getItems() {
    const items = await ProductModel.find().lean();
    return items;
  }

  async getItem(id) {
    const items = await ProductModel.find({ _id: id }).lean();
    return items[0];
  }

  async updateItem(id, newItem) {
    await ProductModel.updateOne({ _id: id }, newItem);
  }

  async deleteItem(id) {
    await ProductModel.deleteOne({ _id: id });
  }
}

export default ProductManager;
