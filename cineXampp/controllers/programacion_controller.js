import { programacionService } from "../service/programacion-service.js";
import { movieService } from "../service/movie-service.js";
import { salaService } from "../service/sala-service.js";

const table = document.querySelector("[data-table]");
const searchInput = document.getElementById("searchInput");

const formatearHora = (hora) => {
    if (!hora) return '-';
    if (/^\d{2}:\d{2}$/.test(hora)) return hora;
    try {
        const [hours, minutes] = hora.split(':');
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    } catch (e) {
        return hora;
    }
};

const crear_nueva_fila = (programacion, peliculas, salas) => {
    const { fecha, hora_inicio, hora_fin, id_pelicula, id_sala, id } = programacion;
    const pelicula = peliculas.find(p => p.id === id_pelicula);
    const sala = salas.find(s => s.id === id_sala);
    
    const fila = document.createElement('tr');
    fila.innerHTML = `
        <td>${fecha || '-'}</td>
        <td>${formatearHora(hora_inicio)}</td>
        <td>${formatearHora(hora_fin)}</td>
        <td>${pelicula ? pelicula.nombre : '-'}</td>
        <td>${sala ? `Sala ${sala.nro_sala}` : '-'}</td>
        <td class="table__align--right">
            <a href="./editar_programacion.html?id=${id}" class="simple-button simple-button--edit">Editar</a>
            <button class="simple-button simple-button--delete" type="button" data-id="${id}">Eliminar</button>
        </td>
    `;
    const btn = fila.querySelector("button");
    btn.addEventListener("click", () => eliminarProgramacion(id, fila));
    return fila;
};

const actualizarTabla = async (programaciones) => {
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }    try {
       
        const peliculas = await movieService.lista_peliculas();
        const salas = await salaService.listar_salas();

        programaciones.forEach(programacion => {
            const nuevaFila = crear_nueva_fila(programacion, peliculas, salas);
            table.appendChild(nuevaFila);
        });
    } catch (error) {
        console.error("Error al cargar datos relacionados:", error);
        table.innerHTML = '<tr><td colspan="6">Error al cargar los datos completos</td></tr>';
    }
};


const cargarDatosIniciales = async () => {
    try {
        table.innerHTML = '<tr><td colspan="6">Cargando...</td></tr>';
        const programaciones = await programacionService.lista_programaciones();
        await actualizarTabla(programaciones);
    } catch (error) {
        console.error(error);
    }
};

const eliminarProgramacion = (id, fila) => {
    if (!confirm("¿Seguro que deseas eliminar esta programación?")) return;
    programacionService.eliminarProgramacion(id)
        .then(() => {
            alert("Programación eliminada");
            fila.remove();
        })
        .catch(error => alert("Error al eliminar la programación: " + error.message));
};



cargarDatosIniciales();
