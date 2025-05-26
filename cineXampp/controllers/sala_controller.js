import { salaService } from "../service/sala-service.js";

const table = document.querySelector("[data-table]");
const searchInput = document.querySelector("#searchInput");



const crear_nueva_fila = (nro_sala, capacidad, id) => {
    const fila = document.createElement('tr');
    const contenido = `
        <td class="td" data-td>${nro_sala}</td>
        <td>${capacidad}</td>
        <td>
            <ul class="table__button-control">
                <li>
                    <a href="../screens/editar_sala.html?id=${id}" class="simple-button simple-button--edit">Editar</a>
                </li>
                <li>
                    <button class="simple-button simple-button--delete" type="button" data-id="${id}">Eliminar</button>
                </li>
            </ul>
        </td>
    `;
    fila.innerHTML = contenido;
    const btn = fila.querySelector("button");
    btn.addEventListener("click", () => eliminarSala(id, fila));
    return fila;
};


const actualizarTabla = (salas) => {
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    salas.forEach(({ nro_sala, capacidad, id }) => {
        const nuevaFila = crear_nueva_fila(nro_sala, capacidad, id);
        table.appendChild(nuevaFila);
    });
};


const cargarDatosIniciales = () => {
    salaService.listar_salas()
        .then(data => actualizarTabla(data))
        .catch(error => alert("Error al cargar las salas: " + error.message));
};


const eliminarSala = (id, fila) => {
    if (!confirm("¿Seguro que deseas eliminar esta sala?")) return;
    salaService.eliminarSala(id)
        .then(() => {
            alert("Sala eliminada");
            fila.remove();
        })
        .catch(error => alert("Error al eliminar la sala: " + error.message));
};


// buscador
if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        const termino = e.target.value.trim();        if (termino === "") {
            cargarDatosIniciales();
        } else {
            salaService.listar_salas()
                .then(salas => {
                    const filtrados = salas.filter(s =>
                        s.nro_sala.toLowerCase().includes(termino.toLowerCase())
                        || (s.capacidad && s.capacidad.toString().includes(termino))
                    );
                    actualizarTabla(filtrados);
                })
                .catch(error => alert("Error al buscar salas: " + error.message));
        }
    });
}

cargarDatosIniciales();

