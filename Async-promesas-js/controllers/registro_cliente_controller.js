// REGISTRO DE CLIENTE SUPABASE
import { clientService } from "../service/client-service.js";

const formulario = document.querySelector("[data-form]");

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const nombre = document.querySelector("[data-nombre]").value.trim();
    const email = document.querySelector("[data-email]").value.trim();

    if (!nombre) {
        alert("El nombre es requerido");
        return;
    }
    if (!email) {
        alert("El email es requerido");
        return;
    }

    clientService.crearCliente(nombre, email)
        .then(() => {
            window.location.href = "../screens/registro_completo_cliente.html";
        })
        .catch((error) => {
            console.error("Error al registrar el cliente:", error);
            alert("Error al registrar el cliente: " + error.message);
            window.location.href = "../screens/error.html";
        });
});
