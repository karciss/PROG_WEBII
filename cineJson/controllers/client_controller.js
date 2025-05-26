import { clientService } from "../service/client-service.js";

const table = document.querySelector("[data-table]");
const searchInput = document.querySelector("#searchInput");


const crear_nueva_fila = (nombre, apellido, edad, telefono, id) => {
    const fila = document.createElement('tr');
    const contenido = `
        <td class="td" data-td>${nombre}</td>
        <td>${apellido}</td>
        <td>${edad}</td>
        <td>${telefono}</td>
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
    btn.addEventListener("click", () => eliminarCliente(id, fila));
    return fila;
};

const actualizarTabla = (clientes) => {
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    clientes.forEach(({ nombre, apellido, edad, telefono, id }) => {
        const nuevaFila = crear_nueva_fila(nombre, apellido, edad, telefono, id);
        table.appendChild(nuevaFila);
    });
};

const cargarDatosIniciales = () => {
    clientService.lista_clientes()
        .then(data => actualizarTabla(data))
        .catch(error => alert("Error al cargar los clientes: " + error.message));
};

const eliminarCliente = (id, fila) => {
    if (!confirm("¿Seguro que deseas eliminar este cliente?")) return;
    clientService.eliminarCliente(id)
        .then(() => {
            alert("Cliente eliminado");
            fila.remove();
        })
        .catch(error => alert("Error al eliminar el cliente: " + error.message));
};

// buscador
if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        const termino = e.target.value.trim();
        if (termino === "") {
            cargarDatosIniciales();
        } else {
            clientService.lista_clientes()
                .then(clientes => {
                    const filtrados = clientes.filter(c =>
                        c.nombre.toLowerCase().includes(termino.toLowerCase()) ||
                        (c.apellido && c.apellido.toLowerCase().includes(termino.toLowerCase())) ||
                        (c.telefono && c.telefono.toLowerCase().includes(termino.toLowerCase()))
                    );
                    actualizarTabla(filtrados);
                })
                .catch(error => alert("Error al buscar clientes: " + error.message));
        }
    });
}

cargarDatosIniciales();

