import { clientService } from "../service/client-service.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

if (!id) {
    alert("No se proporcionó un ID de cliente");
    window.location.href = "../screens/lista_cliente.html";
}

const nombreInput = document.querySelector("[data-nombre]");
const apellidoInput = document.querySelector("[data-apellido]");
const edadInput = document.querySelector("[data-edad]");
const telefonoInput = document.querySelector("[data-telefono]");

//relleno de datos
clientService.clientes(id)
    .then(clienteArr => {
        const cliente = Array.isArray(clienteArr) ? clienteArr[0] : clienteArr;
        if (!cliente) {
            alert("Cliente no encontrado");
            window.location.href = "../screens/lista_cliente.html";
            return;
        }
        nombreInput.value = cliente.nombre || "";
        apellidoInput.value = cliente.apellido || "";
        edadInput.value = cliente.edad !== undefined ? cliente.edad : "";
        telefonoInput.value = cliente.telefono || "";
    })
    .catch(error => {
        console.error("Error al cargar el cliente:", error);
        alert("Error al cargar el cliente: " + error.message);
        window.location.href = "../screens/lista_cliente.html";
    });


//actuazliar
const formulario = document.querySelector("[data-form]");
formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const nombre = nombreInput.value.trim();
    const apellido = apellidoInput.value.trim();
    const edad = edadInput.value.trim();
    const telefono = telefonoInput.value.trim();
    if (!nombre) {
        alert("El nombre es requerido");
        return;
    }
    if (!apellido) {
        alert("El apellido es requerido");
        return;
    }
    if (!edad || isNaN(edad) || parseInt(edad) <= 0) {
        alert("La edad debe ser un número valido y mayor a 0");
        return;
    }
    if (!telefono) {
        alert("El telefono es requerido");
        return;
    }
    clientService.actualizarCliente(nombre, apellido, edad, telefono, id)
        .then(() => {
            window.location.href = "../screens/edicion_concluida.html";
        })
        .catch((error) => {
            console.error("Error al actualizar el cliente:", error);
            alert("Error al actualizar el cliente: " + error.message);
            window.location.href = "../screens/error.html";
        });
});
