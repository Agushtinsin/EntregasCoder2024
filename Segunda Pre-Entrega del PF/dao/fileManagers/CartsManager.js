import * as fs from "fs";

class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = this.loadCarts();
  }

  loadCarts() {
    try {
      let cartData = fs.readFileSync(this.path);
      return JSON.parse(cartData) || [];
    } catch (error) {
      console.error("Archivo no existente, se creara array vacio");
      return [];
    }
  }

  saveCarts() {
    try {
      const data = JSON.stringify(this.carts, null, 2);
      fs.writeFileSync(this.path, data);
      console.log(`Carrito guardado correctamente en ${this.path}`);
    } catch (error) {
      console.error(`Error al guardar el carrito en ${this.path}:`, error);
    }
  }

  crearCarrito() {
    const nuevoCarrito = {
      id: this.carts.length + 1,
      products: [],
    };

    this.carts.push(nuevoCarrito);
    this.saveCarts();

    return nuevoCarrito;
  }

  getCartById(cartId) {
    return this.carts.find((cart) => cart.id === cartId);
  }

  addProductToCart(cartId, productId, quantity = 1) {
    const carrito = this.getCartById(cartId);

    if (carrito) {
      const productoExistente = carrito.products.find(
        (item) => item.product === productId,
      );

      if (productoExistente) {
        productoExistente.quantity += quantity;
      } else {
        carrito.products.push({
          product: productId,
          quantity: quantity,
        });
      }

      this.saveCarts();
      return carrito;
    }

    return null;
  }
}

export default CartManager;
