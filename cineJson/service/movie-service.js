const API_URL = 'http://localhost:3000/pelicula';

const lista_peliculas = () => 
    fetch(API_URL).then((respuesta) => respuesta.json());

const pelicula = (id) => 
    fetch(`${API_URL}/${id}`).then((respuesta) => respuesta.json());

const crearPelicula = (nombre, genero, duracion) => {
    return fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            id: uuid.v4(),
            nombre, 
            genero, 
            duracion: parseInt(duracion)
        })
    });
};

const actualizarPelicula = (nombre, genero, duracion, id) => {
    return fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            nombre, 
            genero, 
            duracion: parseInt(duracion)
        })
    });
};

const eliminarPelicula = (id) => {
    return fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
};

export const movieService = {
    lista_peliculas,
    pelicula,
    crearPelicula,
    actualizarPelicula,
    eliminarPelicula
};
