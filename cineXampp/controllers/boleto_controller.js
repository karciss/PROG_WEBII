import { boletoService } from "../service/boleto-service.js";
import { clientService } from "../service/client-service.js";

const table = document.querySelector("[data-table]");
const searchInput = document.querySelector("#searchInput");


const crear_nueva_fila = (boleto) => {
    const fila = document.createElement('tr');
    
    const contenido = `
        <td class="td" data-td>${boleto.nro_asiento}</td>
        <td>${boleto.id_programacion}</td>
        <td>${boleto.cliente_nombre} ${boleto.cliente_apellido}</td>
        <td>
            <ul class="table__button-control">
                <li>
                    <a href="../screens/editar_boleto.html?id=${boleto.id}" class="simple-button simple-button--edit">Editar</a>
                </li>
                <li>
                    <button class="simple-button simple-button--delete" type="button" data-id="${boleto.id}">Eliminar</button>
                </li>
            </ul>
        </td>
    `;
    fila.innerHTML = contenido;
    const btn = fila.querySelector("button");
    btn.addEventListener("click", () => eliminarBoleto(boleto.id, fila));
    return fila;
};

const actualizarTabla = (boletos) => {
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    boletos.forEach(boleto => {
        const nuevaFila = crear_nueva_fila(boleto);
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

