const API_URL= 'http://localhost:3000/sala';

const lista_salas = () => 
    fetch(API_URL).then((respuesta) => respuesta.json());

const sala = (id) => 
    fetch(`${API_URL}/${id}`).then((respuesta) => respuesta.json());

const crearSala = (nro_sala, capacidad) => {
    return fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: uuid.v4(),
            nro_sala,
            capacidad: parseInt(capacidad)
        })
    });
};

const actualizarSala = (nro_sala, capacidad, id) => {
    return fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nro_sala,
            capacidad: parseInt(capacidad)
        })
    });
};

const eliminarSala = (id) => {
    return fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
};

export const salaService = {
    lista_salas,
    sala,
    crearSala,
    actualizarSala,
    eliminarSala
};
