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

    petService
        .actualizarPet(nombre, raza, edad, id)
        .then(() => {
            window.location.href = "../screens/lista_pets.html";
        })
        .catch((error) => {
            console.error("Error al actualizar el pet:", error);
            window.location.href = "../screens/error.html";
        });
});