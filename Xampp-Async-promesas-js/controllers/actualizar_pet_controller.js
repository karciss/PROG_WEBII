// CONEXION XAMPP
import { petService } from "../service/pet-service.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

if (!id) {
    alert("No se proporcionó un ID de pet");
    window.location.href = "../screens/lista_pets.html";
}

const nombreInput = document.querySelector("[data-nombre]");
const razaInput = document.querySelector("[data-raza]");
const edadInput = document.querySelector("[data-edad]");
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

// rellenar el formulario con los datos del pet
petService.pet(id)
    .then(pet => {
        if (!pet) {
            alert("Pet no encontrado");
            window.location.href = "../screens/lista_pets.html";
            return;
        }
        nombreInput.value = pet.nombre;
        razaInput.value = pet.raza;
        edadInput.value = pet.edad;
        if (pet.cliente_id) {
            clienteSelect.value = pet.cliente_id;
        }
    })
    .catch(error => {
        console.error("Error al cargar el pet:", error);
        alert("Error al cargar el pet");
        window.location.href = "../screens/lista_pets.html";
    });

const formulario = document.querySelector("[data-form]");

// Actualizar el pet
formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const nombre = nombreInput.value;
    const raza = razaInput.value;
    const edad = parseInt(edadInput.value);
    const clienteId = clienteSelect.value;

    if (!clienteId || clienteId === "") {
        alert("Debes seleccionar un dueño");
        return;
    }

    petService
        .actualizarPet(nombre, raza, edad, clienteId, id)
        .then(() => {
            window.location.href = "../screens/registro_completo_pet.html";
        })
        .catch((error) => {
            console.error("Error al actualizar el pet:", error);
            alert("Error al actualizar el pet");
            window.location.href = "../screens/error.html";
        });
});