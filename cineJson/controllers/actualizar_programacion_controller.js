import { programacionService } from "../service/programacion-service.js";
import { movieService } from "../service/movie-service.js";
import { salaService } from "../service/sala-service.js";

const form = document.getElementById("formEditarProgramacion");
const inputFecha = form.querySelector("[data-fecha]");
const inputHoraInicio = form.querySelector("[data-hora-inicio]");
const inputHoraFin = form.querySelector("[data-hora-fin]");
const selectPelicula = form.querySelector("[data-id-pelicula]");
const selectSala = form.querySelector("[data-id-sala]");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  alert("No se proporcionó un ID de programación");
  window.location.href = "./lista_programacion.html";
}

movieService.lista_peliculas()
  .then(peliculas => {
    peliculas.forEach(pelicula => {
      const option = document.createElement("option");
      option.value = pelicula.id;
      option.textContent = pelicula.nombre;
      selectPelicula.appendChild(option);
    });
  })
  .catch(error => console.error("Error al cargar las películas:", error));


salaService.lista_salas()
  .then(salas => {
    salas.forEach(sala => {
      const option = document.createElement("option");
      option.value = sala.id;
      option.textContent = sala.nro_sala;
      selectSala.appendChild(option);
    });
  })
  .catch(error => console.error("Error al cargar las salas:", error));

// relleno datos
programacionService.programacion(id)
  .then(programaciones => {
    const prog = Array.isArray(programaciones) ? programaciones[0] : programaciones;
    if (!prog) {
      alert("Programación no encontrada");
      window.location.href = "./lista_programacion.html";
      return;
    }    console.log("Datos crudos de la programación:", prog);
    
    // formatear la hora para el input
    const formatearHoraParaInput = (horaCompleta) => {
      if (!horaCompleta) return "";
      const match = horaCompleta.match(/^(\d{2}):(\d{2})/);
      if (match) {
        return `${match[1]}:${match[2]}`;
      }
      return "";
    };

    const horaInicioFormateada = formatearHoraParaInput(prog.hora_inicio);
    const horaFinFormateada = formatearHoraParaInput(prog.hora_fin);


    inputFecha.value = prog.fecha;
    inputHoraInicio.value = horaInicioFormateada;
    inputHoraFin.value = horaFinFormateada;


    if (prog.id_pelicula) selectPelicula.value = prog.id_pelicula;
    if (prog.id_sala) selectSala.value = prog.id_sala;
  })
  .catch(error => {
    alert(`Error al cargar la programación: ${error.message}`);
    window.location.href = "./lista_programacion.html";
  });


  
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fecha = inputFecha.value;
  const hora_inicio = inputHoraInicio.value;
  const hora_fin = inputHoraFin.value;
  const id_pelicula = selectPelicula.value;
  const id_sala = selectSala.value;

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
    alert("Debes seleccionar una película");
    return;
  }
  if (!id_sala) {
    alert("Debes seleccionar una sala");
    return;
  }

  try {
    await programacionService.actualizarProgramacion(
      fecha,
      hora_inicio,
      hora_fin,
      id_pelicula,
      id_sala,
      id
    );
    window.location.href = "./lista_programacion.html";
  } catch (err) {
    alert("Error al actualizar programación");
  }
});
