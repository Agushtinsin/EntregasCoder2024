import express from "express";
import expressSession from "express-session";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import MongoStore from "connect-mongo";
import viewsRouter from "./routes/views-router.js";
import itemsRouter from "./routes/items.router.js";
import cartRouter from "./routes/cart.router.js";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { MessageModel } from "./dao/models/message.model.js";
import ProductManager from "./dao/dbManagers/productos.js";
import sessionRouter from "./routes/sessions.router.js";

const session = expressSession;

mongoose
  .connect(
    `mongodb+srv://agus:coderdatabase@codercluster.hpyzqgq.mongodb.net/ecommerce`,
  )
  .then(() => {
    console.log("connected to atlas.");
  });


const app = express();

app.use(session({
  secret:'ourNewSecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: `mongodb+srv://agus:coderdatabase@codercluster.hpyzqgq.mongodb.net/ecommerce`,
    ttl: 3600
  })
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpServer = app.listen(8080, () =>
  console.log("Servidor arriba en el puerto 8080"),
);

const socketServer = new Server(httpServer);

app.use((req, res, next) => {
  req.io = socketServer;
  next();
});

app.engine("handlebars", handlebars.engine({ defaultLayout: false }));
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.static(`${__dirname}/public`));

const manager = new ProductManager();

socketServer.on("connection", async (socket) => {
  console.log("socket connected");

  socket.on("new item", async (newItem) => {
    await manager.addItem(newItem);
    const items = await manager.getItems();
    socket.emit("list updated", items);
  });

  socket.on("delete item", async ({ id }) => {
    await manager.deleteItem(id);
    const items = await manager.getItems();
    socket.emit("list updated", items);
  });

  /** CHAT */
  const messages = await MessageModel.find().lean();
  socket.emit("chat messages", { messages });

  socket.on("new message", async (messageInfo) => {
    await MessageModel.create(messageInfo);
    const messages = await MessageModel.find().lean();
    socket.emit("chat messages", { messages });
  });
});

app.use("/api/items", itemsRouter);
app.use("/api/carts", cartRouter);
app.use('/api/sessions',sessionRouter);
app.use("/", viewsRouter);
