import { Router } from "express";
import CartManager from "../dao/dbManagers/cart.js";
import ProductManager from "../dao/dbManagers/productos.js";

const cartRouter = Router();

const itemsManager = new ProductManager();
const cartManager = new CartManager();

cartRouter.post("/", async (req, res) => {
  await cartManager.addCart();
  res.send({ status: "success" });
});

cartRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const cart = await cartManager.getCart(id);
  res.send({ status: "success", items: cart.products });
});

cartRouter.post("/:id/item/:iid", async (req, res) => {
  const id = req.params.id;
  const itemId = req.params.iid;

  const cart = await cartManager.getCart(id);
  const item = await itemsManager.getItem(itemId);
  if (!cart) {
    res.status(400).send("Cart does not exist");
  }
  if (!item) {
    res.status(400).send("item does not exist");
  }

  cartManager.addItem(id, itemId);

  res.send({ status: "success" });
});

cartRouter.delete("/:cid/item/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  try {
    await cartManager.removeProduct(cartId, productId);
    res.json({ status: "success", message: "Product removed from cart" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

cartRouter.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const newProducts = req.body.products;

  try {
    await cartManager.updateCart(cartId, newProducts);
    res.json({ status: "success", message: "Cart updated successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

cartRouter.put("/:cid/item/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const newQuantity = req.body.quantity;

  try {
    await cartManager.updateProductQuantity(cartId, productId, newQuantity);
    res.json({ status: "success", message: "Product quantity updated in cart" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

cartRouter.delete("/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    await cartManager.removeAllProducts(cartId);
    res.json({ status: "success", message: "All products removed from cart" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default cartRouter;
