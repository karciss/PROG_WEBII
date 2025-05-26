//  json-server --watch cineJson/db.json --port 3000
const API_URL= 'http://localhost:3000/cliente';

const lista_clientes = () => 
    fetch(API_URL).then((respuesta) => respuesta.json());

const cliente = (id) => 
    fetch(`${API_URL}/${id}`).then((respuesta) => respuesta.json());

const crearCliente = (nombre, apellido, edad, telefono) => {
    return fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: uuid.v4(),
            nombre,
            apellido,
            edad: parseInt(edad),
            telefono
        })
    });
};

const actualizarCliente = (nombre, apellido, edad, telefono, id) => {
    return fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre,
            apellido,
            edad: parseInt(edad),
            telefono
        })
    });
};

const eliminarCliente = (id) => {
    return fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
};

export const clientService = {
    lista_clientes,
    cliente,
    crearCliente,
    actualizarCliente,
    eliminarCliente
};
