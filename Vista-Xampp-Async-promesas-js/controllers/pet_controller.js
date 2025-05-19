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
                    <a href="../screens/editar_pet.php?id=${id}" class="simple-button simple-button--edit">Editar</a>
                </li>
                <li>
                    <button class="simple-button simple-button--delete" type="button" data-id="${id}">Eliminar</button>
                </li>
            </ul>
        </td>
    `;
    fila.innerHTML = contenido;
    const btn = fila.querySelector("button");
    btn.addEventListener("click", () => eliminarPet(id, fila));
    return fila;
};

const crear_nueva_fila_without_view = (nombre, raza, edad, cliente_nombre, cliente_email, id) => {
    const fila = document.createElement('tr');
    const contenido = `
        <td class="td" data-td>${nombre}</td>
        <td>${raza}</td>
        <td>${edad}</td>
        <td>${cliente_nombre || 'Sin dueño'}</td>
        <td>${cliente_email || 'Sin email'}</td>
        <td>
            <ul class="table__button-control">
                <li>
                    <a href="../screens/editar_pet.php?id=${id}" class="simple-button simple-button--edit">Editar</a>
                </li>
                <li>
                    <button class="simple-button simple-button--delete" type="button" data-id="${id}">Eliminar</button>
                </li>
            </ul>
        </td>
    `;
    fila.innerHTML = contenido;
    const btn = fila.querySelector("button");
    btn.addEventListener("click", () => eliminarPet(id, fila));
    return fila;
};

const actualizarTablaWithView = (pets) => {
    while (tableWithView.firstChild) {
        tableWithView.removeChild(tableWithView.firstChild);
    }
    pets.forEach(pet => {
        const nuevaFila = crear_nueva_fila_with_view(
            pet.pet_nombre,
            pet.raza,
            pet.edad,
            pet.owner_nombre,
            pet.owner_email,
            pet.id
        );
        tableWithView.appendChild(nuevaFila);
    });
};

const actualizarTablaWithoutView = (pets) => {
    while (tableWithoutView.firstChild) {
        tableWithoutView.removeChild(tableWithoutView.firstChild);
    }
    pets.forEach(pet => {
        const nuevaFila = crear_nueva_fila_without_view(
            pet.nombre,
            pet.raza,
            pet.edad,
            pet.cliente_nombre,
            pet.cliente_email,
            pet.id
        );
        tableWithoutView.appendChild(nuevaFila);
    });
};

const buscarPets = async (term, useView) => {
    let url = `http://localhost/api1/pets1.php`;
    const params = [];
    if (term) params.push(`search=${encodeURIComponent(term)}`);
    if (useView) params.push('useView=true');
    if (params.length > 0) url += `?${params.join('&')}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Error al buscar pets');
    }
    return await response.json();
};

const eliminarPet = async (id, fila) => {
    try {
        const response = await fetch(`http://localhost/Vista-Xampp-Async-promesas-js/screens/pets1.php?id=${id}`, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error('Error al eliminar el pet');
        }
        alert("Pet eliminado");
        fila.remove();
        // Recargar ambas tablas
        const petsWithView = await buscarPets('', true);
        const petsWithoutView = await buscarPets('', false);
        actualizarTablaWithView(petsWithView);
        actualizarTablaWithoutView(petsWithoutView);
    } catch (error) {
        alert("Error al eliminar el pet: " + error.message);
    }
};

// Cargar datos iniciales
const cargarDatosIniciales = async () => {
    try {
        const petsWithView = await buscarPets('', true);
        const petsWithoutView = await buscarPets('', false);
        actualizarTablaWithView(petsWithView);
        actualizarTablaWithoutView(petsWithoutView);
    } catch (error) {
        console.error("Error al cargar pets:", error);
        alert("Error al cargar pets: " + error.message);
    }
};

cargarDatosIniciales();

// Buscador para la tabla con vista
if (searchInputWithView) {
    searchInputWithView.addEventListener("input", async (e) => {
        const termino = e.target.value.trim().toLowerCase();
        try {
            const pets = await buscarPets(termino, true);
            actualizarTablaWithView(pets);
        } catch (error) {
            console.error("Error al buscar pets con vista:", error);
            alert("Error al buscar pets con vista: " + error.message);
        }
    });
} else {
    console.warn("No se encontró el elemento #searchInputWithView en el DOM");
}

// Buscador para la tabla sin vista
if (searchInputWithoutView) {
    searchInputWithoutView.addEventListener("input", async (e) => {
        const termino = e.target.value.trim().toLowerCase();
        try {
            const pets = await buscarPets(termino, false);
            actualizarTablaWithoutView(pets);
        } catch (error) {
            console.error("Error al buscar pets sin vista:", error);
            alert("Error al buscar pets sin vista: " + error.message);
        }
    });
} else {
    console.warn("No se encontró el elemento #searchInputWithoutView en el DOM");
}