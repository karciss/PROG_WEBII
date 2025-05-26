
const API_BASE_URL = 'http://localhost/apiSql/cliente.php';
const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

const lista_clientes = () => {
    return fetch(API_BASE_URL, {
        headers: DEFAULT_HEADERS
    })
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

const buscarClientes = (termino) => {
    const url = `${API_BASE_URL}?search=${encodeURIComponent(termino)}`;
    return fetch(url, {
        headers: DEFAULT_HEADERS
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Error al buscar clientes');
        }
        return response.json();
    })
    .catch((error) => {
        console.error('Error al buscar clientes:', error);
        throw error;
    });
};

const crearCliente = (nombre, apellido, edad, telefono) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    return fetch(API_BASE_URL, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({ 
            id,
            nombre, 
            apellido,
            edad: parseInt(edad),
            telefono
        })
    }).then(async response => {
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al crear el cliente');
        }
        return response.json();
    }).catch(error => {
        console.error('Error al crear el cliente:', error);
        throw error;
    });
};

const eliminarCliente = (id) => {
    return fetch(`${API_BASE_URL}?id=${id}`, {
        method: 'DELETE',
        headers: DEFAULT_HEADERS
    }).then(async response => {
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al eliminar el cliente');
        }
        return response.json();
    }).catch(error => {
        console.error('Error al eliminar el cliente:', error);
        throw error;
    });
};

const cliente = (id) => {
    return fetch(`${API_BASE_URL}?id=${id}`, {
        headers: DEFAULT_HEADERS
    })
    .then(async response => {
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al obtener el cliente');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error al obtener el cliente:', error);
        throw error;
    });
};

const actualizarCliente = (nombre, apellido, edad, telefono, id) => {
    return fetch(API_BASE_URL, {
        method: 'PUT',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({
            nombre,
            apellido,
            edad: parseInt(edad),
            telefono,
            id
        })
    }).then(async response => {
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al actualizar el cliente');
        }
        return response.json();
    }).catch(error => {
        console.error('Error al actualizar el cliente:', error);
        throw error;
    });
};

export const clientService = {
    lista_clientes,
    buscarClientes,
    crearCliente,
    eliminarCliente,
    cliente,
    actualizarCliente
};