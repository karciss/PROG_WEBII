
import { movieService } from "../service/movie-service.js";


const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

if (!id) {
    alert("No se proporcionó un ID de película");
    window.location.href = "../screens/lista_pelicula.html";
}

const nombreInput = document.querySelector("[data-nombre]");
const generoInput = document.querySelector("[data-genero]");
const duracionInput = document.querySelector("[data-duracion]");


movieService.peliculas(id)
    .then(peliculaArr => {
        const pelicula = Array.isArray(peliculaArr) ? peliculaArr[0] : peliculaArr;
        if (!pelicula) {
            alert("Película no encontrada");
            window.location.href = "../screens/lista_pelicula.html";
            return;
        }
        nombreInput.value = pelicula.nombre || "";
        generoInput.value = pelicula.genero || "";
        duracionInput.value = pelicula.duracion !== undefined ? pelicula.duracion : "";
    })
    .catch(error => {
        console.error("Error al cargar la película:", error);
        alert("Error al cargar la película: " + error.message);
        window.location.href = "../screens/lista_pelicula.html";
    });



// Actualizar película
const formulario = document.querySelector("[data-form]");
formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const nombre = nombreInput.value.trim();
    const genero = generoInput.value.trim();
    const duracion = duracionInput.value.trim();
    if (!nombre) {
        alert("El nombre es requerido");
        return;
    }
    if (!genero) {
        alert("El género es requerido");
        return;
    }
    if (!duracion || isNaN(duracion) || parseInt(duracion) <= 0) {
        alert("La duración debe ser un número válido y mayor a 0");
        return;
    }
    movieService.actualizarPelicula(nombre, genero, duracion, id)
        .then(() => {
            window.location.href = "../screens/edicion_concluida_pelicula.html";
        })
        .catch((error) => {
            console.error("Error al actualizar la película:", error);
            alert("Error al actualizar la película: " + error.message);
            window.location.href = "../screens/error.html";
        });
});
