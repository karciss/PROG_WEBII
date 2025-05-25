import { movieService } from "../service/movie-service.js";

const formulario = document.querySelector("[data-form]");

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const nombre = document.querySelector("[data-nombre]").value.trim();
    const genero = document.querySelector("[data-genero]").value.trim();
    const duracion = document.querySelector("[data-duracion]").value.trim();

    if (!nombre) {
        alert("El nombre es requerido");
        return;
    }
    if (!genero) {
        alert("El genero es requerido");
        return;
    }
    if (!duracion || isNaN(duracion) || parseInt(duracion) <= 0) {
        alert("La duracion debe ser un número valido y mayor a 0");
        return;
    }
    

    movieService.crearPelicula(nombre, genero, duracion)
        .then(() => {
            window.location.href = "../screens/registro_completado_pelicula.html";
        })
        .catch((error) => {
            console.error("Error al registrar el cliente:", error);
            alert("Error al registrar la pelicula: " + error.message);
            window.location.href = "../screens/error.html";
        });
});
