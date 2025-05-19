// SIN BUSQEUDA
/*import { clientService } from "../service/client-service.js";

const crear_nueva_fila = (nombre, email, id) => {
    const fila = document.createElement('tr');
    const contenido = `
        <td class="td" data-td>${nombre}</td>
        <td>${email}</td>
        <td>
            <ul class="table__button-control">
                <li>
                    <a href="../screens/editar_cliente.html?id=${id}" class="simple-button simple-button--edit">Editar</a>
                </li>
                <li>
                    <button class="simple-button simple-button--delete" type="button" id="${id}">Eliminar</button>
                </li>
            </ul>
        </td>
    `;
    fila.innerHTML = contenido;
    const btn = fila.querySelector("button");
    btn.addEventListener("click", () => {
        clientService.eliminarCliente(id)
            .then(() => {
                alert("Cliente eliminado");
                fila.remove();
            })
            .catch(error => alert("Error al eliminar el cliente"));
    });
    return fila;
};

const table = document.querySelector("[data-table]");

clientService.lista_clientes()
    .then(data => {
        data.forEach(({ nombre, email, id }) => {
            const nuevaFila = crear_nueva_fila(nombre, email, id);
            table.appendChild(nuevaFila);
        });
    })
    .catch(error => alert("Ocurrio un error al cargar los clientes"));*/




import { clientService } from "../service/client-service.js";

const table = document.querySelector("[data-table]");
const searchInput = document.querySelector("[searchInput]");

const crear_nueva_fila = (nombre, email, id) => {
    const fila = document.createElement('tr');
    const contenido = `
        <td class="td" data-td>${nombre}</td>
        <td>${email}</td>
        <td>
            <ul class="table__button-control">
                <li>
                    <a href="../screens/editar_cliente.html?id=${id}" class="simple-button simple-button--edit">Editar</a>
                </li>
                <li>
                    <button class="simple-button simple-button--delete" type="button" id="${id}">Eliminar</button>
                </li>
            </ul>
        </td>
    `;
    fila.innerHTML = contenido;
    const btn = fila.querySelector("button");
    btn.addEventListener("click", () => {
        clientService.eliminarCliente(id)
            .then(() => {
                alert("Cliente eliminado");
                fila.remove();
            })
            .catch(error => alert("Error al eliminar el cliente"));
    });
    return fila;
};

const actualizarTabla = (clientes) => {
    // limpiar
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    clientes.forEach(({ nombre, email, id }) => {
        const nuevaFila = crear_nueva_fila(nombre, email, id);
        table.appendChild(nuevaFila);
    });
};


clientService.lista_clientes()
    .then(data => {
        actualizarTabla(data);

        searchInput.addEventListener("input", () => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm === "") {
                clientService.lista_clientes().then(data => actualizarTabla(data));
            } else {
                clientService.buscarClientes(searchTerm)
                    .then(clientes => {
                        actualizarTabla(clientes);
                    })
                    .catch(error => {
                        console.error("Error al buscar clientes:", error);
                    });
            }
        });
    })
    .catch(error => alert("Ocurrió un error al cargar los clientes"));