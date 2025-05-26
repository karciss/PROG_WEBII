const API_URL= 'http://localhost:3000/programacion';

const lista_programaciones = () => 
    fetch(API_URL).then((respuesta) => respuesta.json());

const programacion = (id) => 
    fetch(`${API_URL}/${id}`).then((respuesta) => respuesta.json());

const crearProgramacion = (fecha, hora_inicio, hora_fin, id_pelicula, id_sala) => {
    return fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: uuid.v4(),
            fecha,
            hora_inicio,
            hora_fin,
            id_pelicula,
            id_sala
        })
    });
};

const actualizarProgramacion = (fecha, hora_inicio, hora_fin, id_pelicula, id_sala, id) => {
    return fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fecha,
            hora_inicio,
            hora_fin,
            id_pelicula,
            id_sala
        })
    });
};

const eliminarProgramacion = (id) => {
    return fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
};

export const programacionService = {
    lista_programaciones,
    programacion,
    crearProgramacion,
    actualizarProgramacion,
    eliminarProgramacion
};