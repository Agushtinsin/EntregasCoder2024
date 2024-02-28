import { Router } from "express";
import ProductManager from "../dao/dbManagers/productos.js";

const itemsRouter = Router();

const manager = new ProductManager();

itemsRouter.get("/", async (req, res) => {
  let items = await manager.getItems();

  const { limit } = req.query;
  if (limit) {
    items = items.slice(0, limit);
  }

  res.send({ items: items });
});

itemsRouter.get("/:id", async (req, res) => {
  let items = await manager.getItems();
  let id = req.params.id;

  let item = items.find((i) => i._id == id);

  res.send({ item: item });
});

itemsRouter.post("/", async (req, res) => {
  await manager.addItem(req.body);
  const items = await manager.getItems();
  req.io.emit("list updated", { items: items });
  res.redirect("/realtimeitems");
});

itemsRouter.put("/:id", async (req, res) => {
  const id = req.params.id;

  await manager.updateItem(id, req.body);

  res.send({ status: "success" });
});

itemsRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await manager.deleteItem(id);
  res.send({ status: "success" });
});

export default itemsRouter;
