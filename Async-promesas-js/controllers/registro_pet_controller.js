import { petService } from "../service/pet-service.js";

const formulario = document.querySelector("[data-form]");

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const nombre = document.querySelector("[data-nombre]").value;
    const raza = document.querySelector("[data-raza]").value;
    const edad = parseInt(document.querySelector("[data-edad]").value);

    petService
        .crearPet(nombre, raza, edad)
        .then(() => {
            window.location.href = "../screens/registro_completado.html";
        })
        .catch((error) => {
            console.error("Error al registrar el pet:", error);
            window.location.href = "../screens/error.html";
        });
});