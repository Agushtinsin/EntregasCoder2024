import { CartModel } from "../models/cart.model.js";

class CartManager {
  async addCart() {
    const cart = { items: [] };
    await CartModel.create(cart);
  }

  async getCart(id) {
    const cart = await CartModel.findOne({ _id: id });
    return cart;
  }

  async addItem(id, itemId) {
    const cart = await this.getCart(id);

    if (!cart) {
      throw new Error(`Cart with ID ${id} not found`);
    }

    const index = cart.products.findIndex((i) => i.item == itemId);
    if (index >= 0) {
      cart.products.item[index].quantity += 1;
    } else {
      cart.products.push({ item: itemId, quantity: 1 });
    }

    await CartModel.updateOne({ _id: id }, cart);
  }
}

export default CartManager;
