import { petService } from "../service/pet-service.js";
import { clientService } from "../service/client-service.js";

const crear_nueva_fila = (nombre, raza, edad, cliente_id, id) => {
    const fila = document.createElement('tr');
    const contenido = `
        <td class="td" data-td>${nombre}</td>
        <td>${raza}</td>
        <td>${edad}</td>
        <td data-cliente-nombre></td>
        <td>
            <ul class="table__button-control">
                <li>
                    <a href="../screens/editar_pet.html?id=${id}" class="simple-button simple-button--edit">Editar</a>
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
        petService.eliminarPet(id)
            .then(() => {
                alert("Pet eliminado");
                fila.remove();
            })
            .catch(error => alert("Error al eliminar el pet"));
    });
    // Buscar el nombre del dueño usando clientService
    if (cliente_id) {
        clientService.lista_clientes().then(clientes => {
            const cliente = clientes.find(c => c.id === cliente_id);
            const td = fila.querySelector('[data-cliente-nombre]');
            td.textContent = cliente ? cliente.nombre : 'Sin dueño';
        });
    } else {
        const td = fila.querySelector('[data-cliente-nombre]');
        td.textContent = 'Sin dueño';
    }
    return fila;
};

const table = document.querySelector("[data-table]");

petService.lista_pets()
    .then(data => {
        data.forEach(({ nombre, raza, edad, cliente_id, id }) => {
            const nuevaFila = crear_nueva_fila(nombre, raza, edad, cliente_id, id);
            table.appendChild(nuevaFila);
        });
    })
    .catch(error => alert("Ocurrió un error al cargar los pets"));