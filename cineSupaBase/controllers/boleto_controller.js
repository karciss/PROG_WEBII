import { boletoService } from "../service/boleto-service.js";
import { clientService } from "../service/client-service.js";

const table = document.querySelector("[data-table]");
const searchInput = document.querySelector("#searchInput");

const cargarClienteInfo = async (id_cliente) => {
    try {
        const clienteInfo = await clientService.clientes(id_cliente);
        return Array.isArray(clienteInfo) ? clienteInfo[0] : clienteInfo;
    } catch (error) {
        console.error("Error al cargar información del cliente:", error);
        return null;
    }
};

const crear_nueva_fila = async (nro_asiento, id_programacion, id_cliente, id) => {
    const fila = document.createElement('tr');
    let clienteInfo = await cargarClienteInfo(id_cliente);
    const nombreCliente = clienteInfo ? `${clienteInfo.nombre} ${clienteInfo.apellido || ''}` : 'Cliente no encontrado';
    
    const contenido = `
        <td class="td" data-td>${nro_asiento}</td>
        <td>${id_programacion}</td>
        <td>${nombreCliente}</td>
        <td>
            <ul class="table__button-control">
                <li>
                    <a href="../screens/editar_boleto.html?id=${id}" class="simple-button simple-button--edit">Editar</a>
                </li>
                <li>
                    <button class="simple-button simple-button--delete" type="button" data-id="${id}">Eliminar</button>
                </li>
            </ul>
        </td>
    `;
    fila.innerHTML = contenido;
    const btn = fila.querySelector("button");
    btn.addEventListener("click", () => eliminarBoleto(id, fila));
    return fila;
};

const actualizarTabla = (boletos) => {
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    boletos.forEach(async ({ nro_asiento, id_programacion, id_cliente, id }) => {
        const nuevaFila = await crear_nueva_fila(nro_asiento, id_programacion, id_cliente, id);
        table.appendChild(nuevaFila);
    });
};

const cargarDatosIniciales = () => {
    boletoService.lista_boletos()
        .then(data => actualizarTabla(data))
        .catch(error => alert("Error al cargar los boletos: " + error.message));
};

const eliminarBoleto = (id, fila) => {
    if (!confirm("¿Seguro que deseas eliminar este boleto?")) return;
    boletoService.eliminarBoleto(id)
        .then(() => {
            alert("Boleto eliminado");
            fila.remove();
        })
        .catch(error => alert("Error al eliminar el boleto: " + error.message));
};



cargarDatosIniciales();

