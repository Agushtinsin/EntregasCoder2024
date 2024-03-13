import express from "express";
import ProductManager from "../dao/dbManagers/productos.js";

const router = express.Router();

const productManager = new ProductManager();

const publicAccess = (req, res, next)=>{
  if(req.session.user) return res.redirect('/')
  next();
}
const adminAccess = (req, res, next) => {
  console.log("Session user:", req.session.user);
  if (!req.session.user || req.session.user.rol !== "admin") {
    console.log("Redirecting to /");
    return res.redirect('/');
  }
  next();
};

const privateAccess = (req, res, next)=>{
  if(!req.session.user) {
    console.log("not logged in")
    return res.redirect('/login')
  }
  next();
}

router.get("/", privateAccess, async (req, res) => {
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
    res.render("home", {products});
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/realtimeproducts", adminAccess, async (req, res) => {
  const products = await productManager.getItems();
  res.render("realTimeProducts", { products });
});

router.get("/chat", (req, res) => {
  res.render("chat", {});
});

router.get("/products", privateAccess, async (req, res) => {
  const products = await productManager.getItems();
  res.render("products", {user: req.session.user,products});;
});

router.get("/products/:productId", async (req, res) => {
  const productId = req.params.productId;
  const product = await productManager.getItem(productId);
  console.log(product)
  res.render("productsDetails", {product});;
});

router.get('/register', publicAccess, (req, res)=>{
  res.render('register',{})
})

router.get('/login', publicAccess, (req,res)=>{
  res.render('login')
})
router.get('/profile', privateAccess, (req,res)=>{
  res.render('profile',{user: req.session.user})
})

export default router;
