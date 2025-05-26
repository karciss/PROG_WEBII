function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

const API_BASE_URL = 'http://localhost/api1/sala.php';

const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

const lista_salas = () => {
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

const buscarSala = (termino) => {
    const url = `${API_BASE_URL}?search=${encodeURIComponent(termino)}`;
    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error al buscar sala');
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Error al buscar sala:', error);
            throw error;
        });
};

const crearSala = (nro_sala, capacidad) => {
    return fetch(API_BASE_URL, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({ 
            nro_sala, 
            capacidad: parseInt(capacidad),
            id: generarId() 
        })
    }).then(async response => {
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al crear la sala');
        }
        return response.json();
    }).catch(error => {
        console.error('Error al crear la sala:', error);
        throw error;
    });
};

const eliminarSala = (id) => {
    return fetch(`${API_BASE_URL}?id=${id}`, {
        method: 'DELETE'
    }).then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar la sala');
        }
        return response.json();
    });
};

const salas = (id) => {
    return fetch(`${API_BASE_URL}?id=${id}`).then((respuesta) => respuesta.json());
};

const actualizarSala = (nro_sala, capacidad, id) => { 
    return fetch(API_BASE_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            nro_sala, 
            capacidad: parseInt(capacidad), 
            id
        })
    }).then(respuesta => {
        if (!respuesta.ok) {
            throw new Error('Error al actualizar la sala');
        }
        return respuesta.json();
    }).catch(err => {
        console.error(err);
        throw err;
    });
};

export const salaService = {
    lista_salas,
    buscarSala,
    crearSala,
    eliminarSala,
    salas,
    actualizarSala
};
