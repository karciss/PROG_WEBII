function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

const API_BASE_URL = 'http://localhost/api1/conexion.php';

const lista_clientes = () => {
    return fetch(API_BASE_URL)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Error al obtener los datos:', error);
            throw error;
        });
};

const crearCliente = (nombre, email) => {
    return fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, email, id: generarId() })
    }).then(response => {
        if (!response.ok) {
            throw new Error('Error al crear el cliente');
        }
        return response.json();
    });
};

const eliminarCliente = (id) => {
    return fetch(`${API_BASE_URL}?id=${id}`, {
        method: 'DELETE'
    }).then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar el cliente');
        }
        return response.json();
    });
};

const clientes = (id) => {
    return fetch(`${API_BASE_URL}?id=${id}`).then((respuesta) => respuesta.json());
};

const actualizarCliente = (nombre, email, id) => { 
    return fetch(API_BASE_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, email, id })
    }).then(respuesta => {
        if (!respuesta.ok) {
            throw new Error('Error al actualizar el cliente');
        }
        return respuesta.json();
    }).catch(err => {
        console.error(err);
        throw err;
    });
};

export const clientService = {
    lista_clientes,
    crearCliente,
    eliminarCliente,
    clientes,
    actualizarCliente
};