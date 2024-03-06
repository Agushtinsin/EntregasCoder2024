import express from "express";
import ProductManager from "../dao/dbManagers/productos.js";

const router = express.Router();

const productManager = new ProductManager();

router.get("/", async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;

  const options = {
    limit: parseInt(limit),
    skip: (page - 1) * parseInt(limit),
    sort: sort && { price: sort === "asc" ? 1 : -1 },
  };

  const filter = query && { category: query }; 

  try {
    const products = await productManager.getItems(filter, options);
    console.log(products);
    res.render("home", { products });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getItems();
  res.render("realTimeProducts", { products });
});

router.get("/chat", (req, res) => {
  res.render("chat", {});
});

router.get("/products", async (req, res) => {
  const products = await productManager.getItems();
  res.render("products", {products});;
});

router.get("/products/:productId", async (req, res) => {
  const productId = req.params.productId;
  const product = await productManager.getItem(productId);
  console.log(product)
  res.render("productsDetails", {product});;
});

export default router;
