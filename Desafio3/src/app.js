import express from 'express';
import ProductManager from '../ProductManager.js';

const app = express();
const productManager = new ProductManager('files/productos.json')

app.get('/products', (req,res) => {
    const limit = req.query.limit;
    const allProducts = productManager.getProducts();

    if (limit > 0) {
        const limitValue = parseInt(limit);
        const reducedProducts = allProducts.slice(0, limitValue);

        res.send(reducedProducts);
    }

    res.send(allProducts)
})

app.get('/products/:pid', (req,res) => {
    const productId = parseInt(req.params.pid);
    const product = productManager.getProductById(productId);

    if (product !== "Not found.") {
        console.log(product);
        res.send(product);
    } else {
        res.status(404).send("Producto no encontrado.");
    }
})


app.listen(8080, () => {
    console.log("Servidor arriba desde el 8080!")
})