import express from "express";
import ProductManager from "../dao/dbManagers/productos.js";

const router = express.Router();

const productManager = new ProductManager();

router.get("/", async (req, res) => {
  const products = await productManager.getItems();
  console.log(products);
  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getItems();
  res.render("realTimeProducts", { products });
});

router.get("/chat", (req, res) => {
  res.render("chat", {});
});

export default router;
