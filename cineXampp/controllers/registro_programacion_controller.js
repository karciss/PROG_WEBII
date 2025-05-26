import { programacionService } from "../service/programacion-service.js";
import { movieService } from "../service/movie-service.js";
import { salaService } from "../service/sala-service.js";

const formulario = document.querySelector("[data-form]");
const inputFecha = formulario.querySelector("[data-fecha]");
const inputHoraInicio = formulario.querySelector("[data-hora-inicio]");
const inputHoraFin = formulario.querySelector("[data-hora-fin]");
const selectPelicula = formulario.querySelector("[data-id-pelicula]");
const selectSala = formulario.querySelector("[data-id-sala]");

const cargarSelects = async () => {
    try {
        //peliculas
        const peliculas = await movieService.lista_peliculas();
        peliculas.forEach(pelicula => {
            const option = document.createElement("option");
            option.value = pelicula.id;
            option.textContent = pelicula.nombre;
            selectPelicula.appendChild(option);
        });        //salas
        const salas = await salaService.lista_salas();
        salas.forEach(sala => {
            const option = document.createElement("option");
            option.value = sala.id;
            option.textContent = `Sala ${sala.nro_sala}`;
            selectSala.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        alert("Error al cargar los datos: " + error.message);
    }
};


cargarSelects();

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const fecha = inputFecha.value.trim();
    const hora_inicio = inputHoraInicio.value.trim();
    const hora_fin = inputHoraFin.value.trim();
    const id_pelicula = selectPelicula.value.trim();
    const id_sala = selectSala.value.trim();

    if (!fecha) {
        alert("La fecha es requerida");
        return;
    }
    if (!hora_inicio) {
        alert("La hora de inicio es requerida");
        return;
    }
    if (!hora_fin) {
        alert("La hora de fin es requerida");
        return;
    }
    if (!id_pelicula) {
        alert("Debe seleccionar una película");
        return;
    }
    if (!id_sala) {
        alert("Debe seleccionar una sala");
        return;
    }

    programacionService.crearProgramacion(fecha, hora_inicio, hora_fin, id_pelicula, id_sala)
        .then(() => {
            window.location.href = "../screens/registro_completado_programacion.html";
        })
        .catch((error) => {
            console.error("Error al registrar la programación:", error);
            alert("Error al registrar la programación: " + error.message);
            window.location.href = "../screens/error.html";
        });
});
