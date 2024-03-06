import * as fs from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
    this.productos = this.loadProducts();
  }

  loadProducts() {
    try {
      let data = fs.readFileSync(this.path);
      return JSON.parse(data) || [];
    } catch (error) {
      console.error("Archivo no existente, se creara array vacio");
      return [];
    }
  }

  saveProducts() {
    try {
      const data = JSON.stringify(this.productos, null, 2);
      fs.writeFileSync(this.path, data);
      console.log(`Productos guardados correctamente en ${this.path}.`);
    } catch (error) {
      console.error(`Error al guardar los productos en ${this.path}:`, error);
    }
  }

  getProducts() {
    return this.productos;
  }

  addProduct(title, description, code, price, stock, category, thumbnails) {
    const existente = this.productos.some((producto) => producto.code === code);

    if (!title || !description || !code || !price || !stock || !category) {
      console.log("Todos los campos son obligatorios.");
      return;
    }

    if (existente) {
      console.log("Ya existe un producto con ese código.");
      return;
    }

    const nuevoProducto = {
      id: this.productos.length + 1,
      title: title,
      description: description,
      code: code,
      price: price,
      status: true,
      stock: stock,
      category: category,
      thumbnails: thumbnails || [],
    };

    this.productos.push(nuevoProducto);
    this.saveProducts();

    console.log("Producto agregado exitosamente:", nuevoProducto);
  }

  getProductById(idProducto) {
    let productoExistente = this.productos.find(
      (producto) => producto.id === idProducto,
    );
    if (productoExistente) {
      return productoExistente;
    } else {
      return "Not found.";
    }
  }

  updateProduct(idProducto, campoActualizado) {
    let productoExistente = this.productos.find(
      (producto) => producto.id === idProducto,
    );

    if (productoExistente) {
      for (let key in campoActualizado) {
        if (campoActualizado.hasOwnProperty(key)) {
          productoExistente[key] = campoActualizado[key];
        }
      }

      console.log(`Campos actualizados para el objeto con ID ${idProducto}`);
      this.saveProducts();
    } else {
      console.log(`No se encontró un objeto con ID ${idProducto}`);
    }
  }

  deleteProduct(idProducto) {
    const index = this.productos.findIndex(
      (producto) => producto.id === idProducto,
    );

    if (index !== -1) {
      this.productos.splice(index, 1);
      this.saveProducts();
      console.log(`Producto con ID ${idProducto} eliminado correctamente.`);
    } else {
      console.log(
        `No se encontró un producto con ID ${idProducto}. No se eliminó nada.`,
      );
    }
  }
}

export default ProductManager;
