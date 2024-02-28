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

export default cartRouter;
