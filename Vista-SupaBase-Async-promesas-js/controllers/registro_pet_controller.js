import { petService } from "../service/pet-service.js";
import { clientService } from "../service/client-service.js";

const formulario = document.querySelector("[data-form]");
const clienteSelect = document.querySelector("[data-cliente-nombre]");

clientService.lista_clientes()
    .then(clientes => {
        console.log("Clientes cargados desde Supabase:", clientes); 
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
    const nombre = document.querySelector("[data-nombre]").value.trim();
    const raza = document.querySelector("[data-raza]").value.trim();
    const edad = parseInt(document.querySelector("[data-edad]").value);
    const clienteId = clienteSelect.value;

    if (!nombre) {
        alert("El nombre de la mascota es requerido");
        return;
    }

    if (!raza) {
        alert("La raza de la mascota es requerida");
        return;
    }

    if (isNaN(edad) || edad <= 0) {
        alert("La edad debe ser un número válido y mayor a 0");
        return;
    }

    if (!clienteId || clienteId === "") {
        alert("Debes seleccionar un dueño");
        return;
    }

    console.log("Cliente ID seleccionado (como string):", clienteId);

    petService.crearPet(nombre, raza, edad, clienteId)
        .then(() => {
            window.location.href = "../screens/registro_completo_pet.html";
        })
        .catch((error) => {
            console.error("Error al registrar la mascota:", error);
            alert(`Error al registrar la mascota: ${error.message}`);
            window.location.href = "../screens/error.html";
        });
});