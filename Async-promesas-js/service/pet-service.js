function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

const API_BASE_URL = 'http://localhost/api1/pets.php';

const lista_pets = () => {
    return fetch(API_BASE_URL)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error en la respuesta de la API: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Error al obtener los pets:', error);
            throw error;
        });
};

const crearPet = (nombre, raza, edad, cliente_id) => {
    return fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, raza, edad, cliente_id, id: generarId() })
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Error al crear el pet: ${response.status} ${response.statusText}`);
        }
        return response.json();
    }).catch(error => {
        console.error('Error al crear el pet:', error);
        throw error;
    });
};

const eliminarPet = (id) => {
    return fetch(`${API_BASE_URL}?id=${id}`, {
        method: 'DELETE'
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Error al eliminar el pet: ${response.status} ${response.statusText}`);
        }
        return response.json();
    }).catch(error => {
        console.error('Error al eliminar el pet:', error);
        throw error;
    });
};

const pet = (id) => {
    return fetch(`${API_BASE_URL}?id=${id}`)
        .then((respuesta) => {
            if (!respuesta.ok) {
                throw new Error(`Error al obtener el pet: ${respuesta.status} ${respuesta.statusText}`);
            }
            return respuesta.json();
        })
        .catch(error => {
            console.error('Error al obtener el pet:', error);
            throw error;
        });
};

const actualizarPet = (nombre, raza, edad, cliente_id, id) => { 
    return fetch(API_BASE_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, raza, edad, cliente_id, id })
    }).then(respuesta => {
        if (!respuesta.ok) {
            throw new Error(`Error al actualizar el pet: ${respuesta.status} ${respuesta.statusText}`);
        }
        return respuesta.json();
    }).catch(err => {
        console.error('Error al actualizar el pet:', err);
        throw err;
    });
};

export const petService = {
    lista_pets,
    crearPet,
    eliminarPet,
    pet,
    actualizarPet
};