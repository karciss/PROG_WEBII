import { movieService } from "../service/movie-service.js";

const table = document.querySelector("[data-table]");
const searchInput = document.querySelector("#searchInput");


const crear_nueva_fila = (nombre, genero,duracion, id) => {
    const fila = document.createElement('tr');
    const contenido = `
        <td class="td" data-td>${nombre}</td>
        <td>${genero}</td>
        <td>${duracion}</td>
        <td>
            <ul class="table__button-control">
                <li>
                    <a href="../screens/editar_cliente.html?id=${id}" class="simple-button simple-button--edit">Editar</a>
                </li>
                <li>
                    <button class="simple-button simple-button--delete" type="button" data-id="${id}">Eliminar</button>
                </li>
            </ul>
        </td>
    `;
    fila.innerHTML = contenido;
    const btn = fila.querySelector("button");
    btn.addEventListener("click", () => eliminarPelicula(id, fila));
    return fila;
};

const actualizarTabla = (peliculas) => {
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    peliculas.forEach(({ nombre, genero,duracion, id }) => {
        const nuevaFila = crear_nueva_fila(nombre, genero,duracion, id);
        table.appendChild(nuevaFila);
    });
};

const cargarDatosIniciales = () => {
    movieService.lista_peliculas()
        .then(data => actualizarTabla(data))
        .catch(error => alert("Error al cargar las peliculas: " + error.message));
};

const eliminarCliente = (id, fila) => {
    if (!confirm("¿Seguro que deseas eliminar esta pelicula?")) return;
    movieService.eliminarPelicula(id)
        .then(() => {
            alert("Pelicula eliminado");
            fila.remove();
        })
        .catch(error => alert("Error al eliminar la pelicula: " + error.message));
};

// buscador
if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        const termino = e.target.value.trim();
        if (termino === "") {
            cargarDatosIniciales();
        } else {
            movieService.lista_peliculas()
                .then(peliculas => {
                    const filtrados = peliculas.filter(c =>
                        c.nombre.toLowerCase().includes(termino.toLowerCase()) ||
                        (c.genero && c.genero.toLowerCase().includes(termino.toLowerCase())) 
                    );
                    actualizarTabla(filtrados);
                })
                .catch(error => alert("Error al buscar peliculas: " + error.message));
        }
    });
}

cargarDatosIniciales();

