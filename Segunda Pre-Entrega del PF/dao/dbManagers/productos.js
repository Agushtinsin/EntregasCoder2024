import { ProductModel } from "../models/product.model.js";

class ProductManager {
  async addItem(item) {
    await ProductModel.create(item);
  }

  async getItems(filter = {}, options = {}) {
    const items = await ProductModel.find(filter).lean().limit(options.limit).skip(options.skip).sort(options.sort);
    return items;
  }

  async getItemsCount(filter = {}) {
    const count = await ProductModel.countDocuments(filter);
    return count;
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
