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

  async removeProduct(cartId, productId) {
    const cart = await this.getCart(cartId);

    if (!cart) {
      throw new Error(`Cart with ID ${cartId} not found`);
    }

    cart.products = cart.products.filter((product) => product.item.toString() !== productId);

    await CartModel.updateOne({ _id: cartId }, cart);
  }

  async updateCart(cartId, newProducts) {
    const cart = await this.getCart(cartId);

    if (!cart) {
      throw new Error(`Cart with ID ${cartId} not found`);
    }

    cart.products = newProducts;

    await CartModel.updateOne({ _id: cartId }, cart);
  }

  async updateProductQuantity(cartId, productId, newQuantity) {
    const cart = await this.getCart(cartId);

    if (!cart) {
      throw new Error(`Cart with ID ${cartId} not found`);
    }

    const product = cart.products.find((p) => p.item.toString() === productId);

    if (product) {
      product.quantity = newQuantity;
    }

    await CartModel.updateOne({ _id: cartId }, cart);
  }

  async removeAllProducts(cartId) {
    const cart = await this.getCart(cartId);

    if (!cart) {
      throw new Error(`Cart with ID ${cartId} not found`);
    }

    cart.products = [];

    await CartModel.updateOne({ _id: cartId }, cart);
  }
}

export default CartManager;
