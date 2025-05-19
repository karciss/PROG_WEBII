import { petService } from "../service/pet-service.js";

const tableWithView = document.querySelector("[data-table-with-view]");
const searchInputWithView = document.querySelector("#searchInputWithView");
const tableWithoutView = document.querySelector("[data-table-without-view]");
const searchInputWithoutView = document.querySelector("#searchInputWithoutView");

const crear_nueva_fila_with_view = (pet_nombre, raza, edad, owner_nombre, owner_email, id) => {
    const fila = document.createElement('tr');
    const contenido = `
        <td class="td" data-td>${pet_nombre}</td>
        <td>${raza}</td>
        <td>${edad}</td>
        <td>${owner_nombre || 'Sin dueño'}</td>
        <td>${owner_email || 'Sin email'}</td>
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
            .catch(error => alert("Error al eliminar el pet: " + error.message));
    });
    return fila;
};

const crear_nueva_fila_without_view = (nombre, raza, edad, perfil, id) => {
    const fila = document.createElement('tr');
    const contenido = `
        <td class="td" data-td>${nombre}</td>
        <td>${raza}</td>
        <td>${edad}</td>
        <td>${perfil && perfil.nombre ? perfil.nombre : 'Sin dueño'}</td>
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
            .catch(error => alert("Error al eliminar el pet: " + error.message));
    });
    return fila;
};

const actualizarTablaWithView = (pets) => {
    tableWithView.innerHTML = '';
    pets.forEach(({ pet_nombre, raza, edad, owner_nombre, owner_email, id }) => {
        const nuevaFila = crear_nueva_fila_with_view(pet_nombre, raza, edad, owner_nombre, owner_email, id);
        tableWithView.appendChild(nuevaFila);
    });
};

const actualizarTablaWithoutView = (pets) => {
    tableWithoutView.innerHTML = '';
    pets.forEach(({ nombre, raza, edad, perfil, id }) => {
        const nuevaFila = crear_nueva_fila_without_view(nombre, raza, edad, perfil, id);
        tableWithoutView.appendChild(nuevaFila);
    });
};

// Cargar datos iniciales
petService.lista_pets(true)
    .then(data => actualizarTablaWithView(data))
    .catch(error => {
        console.error("Error al cargar los pets con vista:", error);
        alert("Error al cargar los pets con vista: " + error.message);
    });

petService.lista_pets(false)
    .then(data => actualizarTablaWithoutView(data))
    .catch(error => {
        console.error("Error al cargar los pets sin vista:", error);
        alert("Error al cargar los pets sin vista: " + error.message);
    });

// Configurar buscadores
searchInputWithView.addEventListener("input", (e) => {
    const termino = e.target.value.trim();
    petService.buscarPets(termino, true)
        .then(pets => actualizarTablaWithView(pets))
        .catch(error => {
            console.error("Error al buscar pets con vista:", error);
            alert("Error al buscar pets con vista: " + error.message);
        });
});

searchInputWithoutView.addEventListener("input", (e) => {
    const termino = e.target.value.trim().toLowerCase();
    petService.lista_pets(false)
        .then(pets => {
            const filtrados = pets.filter(pet =>
                pet.nombre.toLowerCase().includes(termino) ||
                (pet.perfil?.nombre && pet.perfil.nombre.toLowerCase().includes(termino))
            );
            actualizarTablaWithoutView(filtrados);
        })
        .catch(error => {
            console.error("Error al buscar pets sin vista:", error);
            alert("Error al buscar pets sin vista: " + error.message);
        });
});
