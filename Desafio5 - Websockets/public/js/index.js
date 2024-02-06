document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  const updateTable = (products) => {
    const tableBody = document.getElementById("productTableBody");
    tableBody.innerHTML = "";

    products.forEach((product) => {
      const row = tableBody.insertRow();
      row.innerHTML = `
        <td>${product.title}</td>
        <td>${product.description}</td>
        <td>${product.code}</td>
        <td>${product.price}</td>
        <td>${product.stock}</td>
        <td>${product.category}</td>
        <td>
          ${
            Array.isArray(product.thumbnails)
              ? product.thumbnails
                  .map(
                    (thumbnail) =>
                      `<img src="${thumbnail}" alt="Thumbnail" style="max-width: 50px; max-height: 50px;">`,
                  )
                  .join("")
              : ""
          }
        </td>
      `;
    });
  };

  const addProductForm = document.getElementById("addProductForm");
  addProductForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(addProductForm);
    const productData = {};
    formData.forEach((value, key) => {
      productData[key] = value;
    });

    socket.emit("addProduct", productData);
  });

  socket.on("productAdded", (products) => {
    updateTable(products);
  });
});
