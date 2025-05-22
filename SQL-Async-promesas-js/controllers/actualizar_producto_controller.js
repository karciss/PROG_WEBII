import { productService } from "../service/product-service.js";

// Obtener el ID del producto desde la URL
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

if (!id) {
    alert("No se proporcionó un ID de producto");
    window.location.href = "../screens/lista_productos.html";
}

const nombreInput = document.querySelector("[data-nombre]");
const precioInput = document.querySelector("[data-precio]");
const descripcionInput = document.querySelector("[data-descripcion]");

//rellenar el formulario con los datos del producto
productService.producto(id)
    .then(producto => {
        if (!producto) {
            alert("Producto no encontrado");
            window.location.href = "../screens/lista_productos.html";
            return;
        }
        nombreInput.value = producto.nombre;
        precioInput.value = producto.precio;
        descripcionInput.value = producto.descripcion || "";
    })
    .catch(error => {
        console.error("Error al cargar el producto:", error);
        alert("Error al cargar el producto");
        window.location.href = "../screens/lista_productos.html";
    });


// Actualizar el producto
const formulario = document.querySelector("[data-form]");
formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const nombre = nombreInput.value;
    const precio = parseFloat(precioInput.value);
    const descripcion = descripcionInput.value;

    productService
        .actualizarProducto(nombre, precio, descripcion, id)
        .then(() => {
            window.location.href = "../screens/edicion_concluida_producto.html";
        })
        .catch((error) => {
            console.error("Error al actualizar el producto:", error);
            window.location.href = "../screens/error.html";
        });
});