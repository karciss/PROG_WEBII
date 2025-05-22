import { clientService } from "../service/client-service.js";

const formulario = document.querySelector("[data-form]");

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const nombre = document.querySelector("[data-nombre]").value.trim();
    const apellido = document.querySelector("[data-apellido]").value.trim();
    const edad = document.querySelector("[data-edad]").value.trim();
    const telefono = document.querySelector("[data-telefono]").value.trim();

    if (!nombre) {
        alert("El nombre es requerido");
        return;
    }
    if (!apellido) {
        alert("El apellido es requerido");
        return;
    }
    if (!edad || isNaN(edad) || parseInt(edad) <= 0) {
        alert("La edad debe ser un número válido y mayor a 0");
        return;
    }
    if (!telefono) {
        alert("El teléfono es requerido");
        return;
    }

    clientService.crearCliente(nombre, apellido, edad, telefono)
        .then(() => {
            window.location.href = "../screens/registro_completado.html";
        })
        .catch((error) => {
            console.error("Error al registrar el cliente:", error);
            alert("Error al registrar el cliente: " + error.message);
            window.location.href = "../screens/error.html";
        });
});
