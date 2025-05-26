function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

const API_BASE_URL = 'http://localhost/apiSql/pelicula.php';

const listar_peliculas = () => {
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

const buscarPelicula = (termino) => {
    const url = `${API_BASE_URL}?search=${encodeURIComponent(termino)}`;
    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error al buscar película');
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Error al buscar película:', error);
            throw error;
        });
};

const crearPelicula = (nombre, genero, duracion) => {
    const id = generarId();
    return fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            id,
            nombre, 
            genero, 
            duracion: parseInt(duracion)
        })
    }).then(async response => {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Error al crear la película');
        }
        return data;
    }).catch(error => {
        console.error('Error completo:', error);
        throw error;
    });
};

const eliminarPelicula = (id) => {
    return fetch(`${API_BASE_URL}?id=${id}`, {
        method: 'DELETE'
    }).then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.message || 'Error al eliminar la película');
            });
        }
        return response.json();
    });
};

const pelicula = (id) => {
    return fetch(`${API_BASE_URL}?id=${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener la película');
            }
            return response.json();
        });
};

const actualizarPelicula = (nombre, genero, duracion, id) => { 
    return fetch(API_BASE_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            nombre, 
            genero, 
            duracion: parseInt(duracion),
            id 
        })
    }).then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.message || 'Error al actualizar la película');
            });
        }
        return response.json();
    });
};



export const movieService = {
    lista_peliculas: listar_peliculas,
    buscarPelicula,
    crearPelicula,
    eliminarPelicula,
    pelicula,
    actualizarPelicula
};
