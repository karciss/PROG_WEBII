// CONEXION XAMPP
/*import { petService } from "../service/pet-service.js";

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

// Rellenar el formulario con los datos del pet
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
});*/


// CONEXION SUPABASE
import { petService } from "../service/pet-service.js";
import { clientService } from "../service/client-service.js";

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

// Cargar la lista de clientes para el combobox (usando Supabase)
clientService.lista_clientes()
    .then(clientes => {
        clientes.forEach(cliente => {
            const option = document.createElement("option");
            option.value = cliente.id;
            option.textContent = cliente.nombre;
            clienteSelect.appendChild(option);
        });
    })
    .catch(error => console.error("Error al cargar los clientes:", error));

// Rellenar el formulario con los datos del pet
petService.pet(id)
    .then(pet => {
        if (!pet || (Array.isArray(pet) && pet.length === 0)) {
            alert("Pet no encontrado");
            window.location.href = "../screens/lista_pets.html";
            return;
        }
        // Asegurarse de manejar el caso de array
        const petData = Array.isArray(pet) ? pet[0] : pet;
        nombreInput.value = petData.nombre || "";
        razaInput.value = petData.raza || "";
        edadInput.value = petData.edad !== undefined ? petData.edad : "";
        if (petData.cliente_id) {
            clienteSelect.value = petData.cliente_id;
            if (clienteSelect.value !== petData.cliente_id) {
                console.warn("El cliente_id del pet no coincide con las opciones del combobox");
            }
        }
    })
    .catch(error => {
        console.error("Error al cargar el pet:", error);
        alert(`Error al cargar el pet: ${error.message}`);
        window.location.href = "../screens/lista_pets.html";
    });

const formulario = document.querySelector("[data-form]");
formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const nombre = nombreInput.value.trim();
    const raza = razaInput.value.trim();
    const edad = parseInt(edadInput.value);
    const clienteId = clienteSelect.value;

    if (!clienteId || clienteId === "") {
        alert("Debes seleccionar un dueño");
        return;
    }

    if (isNaN(edad) || edad <= 0) {
        alert("La edad debe ser un número válido y mayor a 0");
        return;
    }

    petService
        .actualizarPet(nombre, raza, edad, clienteId, id)
        .then(() => {
            window.location.href = "../screens/edicion_concluida_pets.html";
        })
        .catch((error) => {
            console.error("Error al actualizar el pet:", error);
            alert(`Error al actualizar el pet: ${error.message}`);
            window.location.href = "../screens/error.html";
        });
});