import { petService } from "../service/pet-service.js";

const formulario = document.querySelector("[data-form]");
const clienteSelect = document.querySelector("[data-cliente-nombre]");

// Cargar la lista de clientes para el combobox
fetch("http://localhost/api1/conexion.php")
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al cargar los clientes");
        }
        return response.json();
    })
    .then(clientes => {
        clientes.forEach(cliente => {
            const option = document.createElement("option");
            option.value = cliente.id; 
            option.textContent = cliente.nombre; 
            clienteSelect.appendChild(option);
        });
    })
    .catch(error => console.error("Error al cargar los clientes:", error));

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const nombre = document.querySelector("[data-nombre]").value;
    const raza = document.querySelector("[data-raza]").value;
    const edad = parseInt(document.querySelector("[data-edad]").value);
    const clienteId = clienteSelect.value;

    if (!clienteId || clienteId === "") {
        alert("Debes seleccionar un dueño");
        return;
    }

    petService
        .crearPet(nombre, raza, edad, clienteId)
        .then(() => {
            window.location.href = "../screens/registro_completo_pet.html";
        })
        .catch((error) => {
            console.error("Error al registrar el pet:", error);
            alert("Error al registrar el pet");
            window.location.href = "../screens/error.html";
        });
});