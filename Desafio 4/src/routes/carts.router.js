import Router from "express";
import CartsManager from "../../CartsManager.js";

const cartsRouter = Router();

const cartsManager = new CartsManager("files/carrito.json");

cartsRouter.post("/", (req, res) => {
  const nuevoCarrito = cartsManager.crearCarrito();
  res.json(`${nuevoCarrito} creado correctamente.`);
});

cartsRouter.get("/:cid", (req, res) => {
  const idCarrito = req.params.cid;
  const carrito = cartsManager.getCartById(idCarrito);

  if (carrito) {
    res.json(carrito.products);
  } else {
    res.status(404).send(`El carrito con ID: ${idCarrito} no existe.`);
  }
});

cartsRouter.post("/:cid/product/:pid", (req, res) => {
  const idCarrito = req.params.cid;
  const idProducto = req.params.pid;
  const cantidad = 1;

  const carritoActualizado = cartsManager.addProductToCart(
    idCarrito,
    idProducto,
    cantidad,
  );

  if (carritoActualizado) {
    res.json(carritoActualizado);
  } else {
    res.status(404).send(`El carrito con ID: ${idCarrito} no existe.`);
  }
});

export default cartsRouter;
