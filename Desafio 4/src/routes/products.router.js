import Router from "express";
import ProductManager from "../../ProductManager.js";

const productRouter = Router();

const productManager = new ProductManager("files/productos.json");

productRouter.post("/", (req, res) => {
  const body = req.body;

  productManager.addProduct(
    body.title,
    body.description,
    body.code,
    body.price,
    body.stock,
    body.category,
    body.thumbnails ? body.thumbnails : [],
  );

  res.send("Producto agregado correctamente!");
});

productRouter.put("/:pid", (req, res) => {
  const pid = req.params.pid;
  const campoActualizado = req.body;

  if (Object.keys(campoActualizado).length === 0) {
    res.status(400).send("No se proporcionaron campos para actualizar.");
    return;
  }

  productManager.updateProduct(pid, campoActualizado);

  res.send(`Producto con ID ${pid} actualizado correctamente.`);
});

productRouter.delete("/:pid", (req, res) => {
  const pid = req.params.pid;

  productManager.deleteProduct(pid);

  res.send(`Producto con ID ${pid} eliminado correctamente!`);
});

productRouter.get("/", (req, res) => {
  const limit = req.query.limit;
  const allProducts = productManager.getProducts();

  if (limit > 0) {
    const limitValue = parseInt(limit);
    const reducedProducts = allProducts.slice(0, limitValue);

    res.send(reducedProducts);
  }

  res.send(allProducts);
});

productRouter.get("/:pid", (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = productManager.getProductById(productId);

  if (product !== "Not found.") {
    console.log(product);
    res.send(product);
  } else {
    res.status(404).send("Producto no encontrado.");
  }
});

export default productRouter;
