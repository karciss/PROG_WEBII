import { salaService } from "../service/sala-service.js";

const formulario = document.querySelector("[data-form]");


formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const nro_sala = document.querySelector("[data-nro_sala]").value.trim();
    const capacidad = document.querySelector("[data-capacidad]").value.trim();

    if (!nro_sala) {
        alert("El número de sala es requerido");
        return;
    }
    if (!capacidad || isNaN(capacidad) || parseInt(capacidad) <= 0) {
        alert("La capacidad debe ser un número válido y mayor a 0");
        return;
    }

    salaService.crearSala(nro_sala, capacidad)
        .then(() => {
            window.location.href = "../screens/registro_completado_sala.html";
        })
        .catch((error) => {
            console.error("Error al registrar la sala:", error);
            alert("Error al registrar la sala: " + error.message);
            window.location.href = "../screens/error.html";
        });
});
