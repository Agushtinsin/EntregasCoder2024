import { Router } from "express";
import ProductManager from "../dao/dbManagers/productos.js";

const itemsRouter = Router();

const manager = new ProductManager();

itemsRouter.get("/", async (req, res) => {
  try {
    const { limit = 2, page = 1, sort, category, availability } = req.query;

    const options = {
      limit: parseInt(limit),
      skip: (page - 1) * parseInt(limit),
      sort: sort && { price: sort === "asc" ? 1 : -1 },
    };

    const filter = {};
    if (category) {
      filter.category = category;
    }
    if (availability !== undefined) {
      filter.status = availability === 'true';
    }

    const items = await manager.getItems(filter, options);

    const totalItems = await manager.getItemsCount(filter);
    const totalPages = Math.ceil(totalItems / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    const response = {
      status: "success",
      payload: items,
      totalPages,
      prevPage: hasPrevPage ? page - 1 : null,
      nextPage: hasNextPage ? page + 1 : null,
      page: parseInt(page),
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage ? `${req.baseUrl}?page=${page - 1}&limit=${limit}&sort=${sort}` : null,
      nextLink: hasNextPage ? `${req.baseUrl}?page=${page + 1}&limit=${limit}&sort=${sort}` : null,
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
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
