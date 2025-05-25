
import { salaService } from "../service/sala_service.js";


const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

if (!id) {
    alert("No se proporcionó un ID de película");
    window.location.href = "../screens/lista_pelicula.html";
}


const nroSalaInput = document.querySelector("[data-nro_sala]");
const capacidadInput = document.querySelector("[data-capacidad]");



salaService.salas(id)
    .then(salaArr => {
        const sala = Array.isArray(salaArr) ? salaArr[0] : salaArr;
        if (!sala) {
            alert("Sala no encontrada");
            window.location.href = "../screens/lista_sala.html";
            return;
        }
        nroSalaInput.value = sala.nro_sala || "";
        capacidadInput.value = sala.capacidad !== undefined ? sala.capacidad : "";
    })
    .catch(error => {
        console.error("Error al cargar la sala:", error);
        alert("Error al cargar la sala: " + error.message);
        window.location.href = "../screens/lista_sala.html";
    });




// Actualizar sala
const formulario = document.querySelector("[data-form]");
formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const nro_sala = nroSalaInput.value.trim();
    const capacidad = capacidadInput.value.trim();
    if (!nro_sala) {
        alert("El número de sala es requerido");
        return;
    }
    if (!capacidad || isNaN(capacidad) || parseInt(capacidad) <= 0) {
        alert("La capacidad debe ser un número válido y mayor a 0");
        return;
    }
    salaService.actualizarSala(nro_sala, capacidad, id)
        .then(() => {
            window.location.href = "../screens/edicion_concluida_sala.html";
        })
        .catch((error) => {
            console.error("Error al actualizar la sala:", error);
            alert("Error al actualizar la sala: " + error.message);
            window.location.href = "../screens/error.html";
        });
});
