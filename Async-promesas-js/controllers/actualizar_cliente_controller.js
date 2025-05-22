// ACTUALIZAR CLIENTE SUPABASE
import { clientService } from "../service/client-service.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

if (!id) {
    alert("No se proporcionó un ID de cliente");
    window.location.href = "../screens/lista_cliente.html";
}

const nombreInput = document.querySelector("[data-nombre]");
const emailInput = document.querySelector("[data-email]");

// Rellenar el formulario con los datos del cliente
clientService.clientes(id)
    .then(clienteArr => {
        const cliente = Array.isArray(clienteArr) ? clienteArr[0] : clienteArr;
        if (!cliente) {
            alert("Cliente no encontrado");
            window.location.href = "../screens/lista_cliente.html";
            return;
        }
        nombreInput.value = cliente.nombre || "";
        emailInput.value = cliente.email || "";
    })
    .catch(error => {
        console.error("Error al cargar el cliente:", error);
        alert("Error al cargar el cliente: " + error.message);
        window.location.href = "../screens/lista_cliente.html";
    });

const formulario = document.querySelector("[data-form]");
formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const nombre = nombreInput.value.trim();
    const email = emailInput.value.trim();
    if (!nombre) {
        alert("El nombre es requerido");
        return;
    }
    if (!email) {
        alert("El email es requerido");
        return;
    }
    clientService.actualizarCliente(nombre, email, id)
        .then(() => {
            window.location.href = "../screens/edicion_concluida_cliente.html";
        })
        .catch((error) => {
            console.error("Error al actualizar el cliente:", error);
            alert("Error al actualizar el cliente: " + error.message);
            window.location.href = "../screens/error.html";
        });
});
