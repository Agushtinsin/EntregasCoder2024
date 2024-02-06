import express from "express";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views-router.js";
import handlebars from "express-handlebars";
import ProductManager from "./ProductManager.js";

const productManager = new ProductManager("./files/productos.json");
const app = express();
const httpServer = app.listen(8080, () =>
  console.log("Servidor arriba en el puerto 8080"),
);

const socketServer = new Server(httpServer);

app.engine("handlebars", handlebars.engine({ defaultLayout: false }));
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use("/", viewsRouter);

socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("message", (data) => {
    console.log(data);
  });

  socket.on("addProduct", (product) => {
    productManager.addProduct(
      product.title,
      product.description,
      product.code,
      product.price,
      product.stock,
      product.category,
      product.thumbnails,
    );
    socketServer.emit("productAdded", productManager.getProducts());
  });
});
