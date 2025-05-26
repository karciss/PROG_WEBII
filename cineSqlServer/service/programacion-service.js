function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

const API_BASE_URL = 'http://localhost/apiSql/programacion.php';

const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

const lista_programaciones = () => {
    return fetch(API_BASE_URL, {
        headers: DEFAULT_HEADERS
    })
    .then(async (response) => {
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error en la respuesta de la API');
        }
        return response.json();
    })
    .catch((error) => {
        console.error('Error al obtener las programaciones:', error);
        throw error;
    });
};

const buscarProgramacion = (termino) => {
    const url = `${API_BASE_URL}?search=${encodeURIComponent(termino)}`;
    return fetch(url, {
        headers: DEFAULT_HEADERS
    })
    .then(async (response) => {
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al buscar programación');
        }
        return response.json();
    })
    .catch((error) => {
        console.error('Error al buscar programación:', error);
        throw error;
    });
};

const crearProgramacion = (fecha, hora_inicio, hora_fin, id_pelicula, id_sala) => {
    return fetch(API_BASE_URL, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({
            id: generarId(),
            fecha,
            hora_inicio,
            hora_fin,
            id_pelicula,
            id_sala
        })
    })
    .then(async response => {
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al crear la programación');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error al crear la programación:', error);
        throw error;
    });
};

const eliminarProgramacion = (id) => {
    return fetch(`${API_BASE_URL}?id=${id}`, {
        method: 'DELETE',
        headers: DEFAULT_HEADERS
    })
    .then(async response => {
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al eliminar la programación');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error al eliminar la programación:', error);
        throw error;
    });
};

const programacion = (id) => {
    return fetch(`${API_BASE_URL}?id=${id}`, {
        headers: DEFAULT_HEADERS
    })
    .then(async response => {
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al obtener la programación');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error al obtener la programación:', error);
        throw error;
    });
};

const actualizarProgramacion = (fecha, hora_inicio, hora_fin, id_pelicula, id_sala, id) => {
    return fetch(API_BASE_URL, {
        method: 'PUT',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({
            fecha,
            hora_inicio,
            hora_fin,
            id_pelicula,
            id_sala,
            id
        })
    })
    .then(async response => {
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al actualizar la programación');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error al actualizar la programación:', error);
        throw error;
    });
};

export const programacionService = {
    lista_programaciones,
    buscarProgramacion,
    crearProgramacion,
    eliminarProgramacion,
    programacion,
    actualizarProgramacion
};