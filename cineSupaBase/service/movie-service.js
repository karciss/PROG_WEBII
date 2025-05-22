
function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
const SUPABASE_URL = 'https://jxfzvczkarjvwgnxbedt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4Znp2Y3prYXJqdndnbnhiZWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MTkxODQsImV4cCI6MjA2MzQ5NTE4NH0.cmOx7WfIfB8rY3Bj-EamJ-UXmQlEDZ1alKJ7IK75hyA';
const TABLE = 'pelicula';
const API_URL = `${SUPABASE_URL}/rest/v1/${TABLE}`;
const HEADERS = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};


const lista_peliculas = () => {
    return fetch(`${API_URL}?select=*`, { headers: HEADERS })
        .then(res => {
            if (!res.ok) throw new Error('Error al listar películas');
            return res.json();
        });
};


const crearPelicula = (nombre, genero, duracion) => {
    const pelicula = {
        nombre,
        genero,
        duracion: parseInt(duracion),
        id: generarId()
    };
    return fetch(API_URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(pelicula)
    }).then(async (res) => {
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || 'Error al crear la película');
        }
        const text = await res.text();
        return text ? JSON.parse(text) : pelicula;
    }).catch(err => {
        console.error(err || 'Error al crear la película');
        throw err;
    });
};


const eliminarPelicula = (id) => {
    return fetch(`${API_URL}?id=eq.${id}`, {
        method: 'DELETE',
        headers: HEADERS
    }).then(res => {
        if (!res.ok) throw new Error('Error al eliminar película');
        return res;
    }).catch((error) => {
        console.error('Error al eliminar película', error);
        throw error;
    });
};


const peliculas = (id) => {
    return fetch(`${API_URL}?id=eq.${id}`, { headers: HEADERS })
        .then(res => {
            if (!res.ok) {
                throw new Error('Error al obtener la película');
            }
            return res.json();
        });
};


const actualizarPelicula = (nombre, genero, duracion, id) => {
    return fetch(`${API_URL}?id=eq.${id}`, {
        method: 'PATCH',
        headers: HEADERS,
        body: JSON.stringify({ nombre, genero, duracion: parseInt(duracion) })
    })
        .then(async res => {
            if (!res.ok) {
                const text = await res.text();
                console.error('Respuesta de error:', text);
                throw new Error(text || 'Error al actualizar la película');
            }
            const data = await res.json();
            if (!data || (Array.isArray(data) && data.length === 0)) {
                throw new Error('No se encontró la película para actualizar o no se devolvieron datos');
            }
            return Array.isArray(data) ? data[0] : data;
        })
        .catch(err => {
            console.error('Error al actualizar la película:', err);
            throw err;
        });
};


export const movieService = {
    lista_peliculas,
    crearPelicula,
    eliminarPelicula,
    peliculas,
    actualizarPelicula
};