import { productService } from "../service/product-service.js";

const formulario = document.querySelector("[data-form]");

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const nombre = document.querySelector("[data-nombre]").value;
    const precio = parseFloat(document.querySelector("[data-precio]").value);
    const descripcion = document.querySelector("[data-descripcion]").value;

    productService
        .crearProducto(nombre, precio, descripcion)
        .then(() => {
            window.location.href = "../screens/registro_completado.html";
        })
        .catch((error) => {
            console.error(error);
            window.location.href = "../screens/error.html";
        });
});