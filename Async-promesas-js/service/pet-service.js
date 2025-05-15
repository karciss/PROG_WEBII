// CONEXION XAMPP
/*function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

const API_BASE_URL = 'http://localhost/api1/pets.php';

const lista_pets = () => {
    return fetch(API_BASE_URL)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error en la respuesta de la API: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Error al obtener los pets:', error);
            throw error;
        });
};

const crearPet = (nombre, raza, edad, cliente_id) => {
    return fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, raza, edad, cliente_id, id: generarId() })
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Error al crear el pet: ${response.status} ${response.statusText}`);
        }
        return response.json();
    }).catch(error => {
        console.error('Error al crear el pet:', error);
        throw error;
    });
};

const eliminarPet = (id) => {
    return fetch(`${API_BASE_URL}?id=${id}`, {
        method: 'DELETE'
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Error al eliminar el pet: ${response.status} ${response.statusText}`);
        }
        return response.json();
    }).catch(error => {
        console.error('Error al eliminar el pet:', error);
        throw error;
    });
};

const pet = (id) => {
    return fetch(`${API_BASE_URL}?id=${id}`)
        .then((respuesta) => {
            if (!respuesta.ok) {
                throw new Error(`Error al obtener el pet: ${respuesta.status} ${respuesta.statusText}`);
            }
            return respuesta.json();
        })
        .catch(error => {
            console.error('Error al obtener el pet:', error);
            throw error;
        });
};

const actualizarPet = (nombre, raza, edad, cliente_id, id) => { 
    return fetch(API_BASE_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, raza, edad, cliente_id, id })
    }).then(respuesta => {
        if (!respuesta.ok) {
            throw new Error(`Error al actualizar el pet: ${respuesta.status} ${respuesta.statusText}`);
        }
        return respuesta.json();
    }).catch(err => {
        console.error('Error al actualizar el pet:', err);
        throw err;
    });
};

export const petService = {
    lista_pets,
    crearPet,
    eliminarPet,
    pet,
    actualizarPet
};*/


// CONEXION CON SUPABASE
function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

const SUPABASE_URL = 'https://qixdcadprrreesrtoaky.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpeGRjYWRwcnJyZWVzcnRvYWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NzY5MDIsImV4cCI6MjA2MjQ1MjkwMn0.5MUi_Oi-VwvrtrwVqzFbzUmjJEi2D8mvIZNxZmkKfa4';
const TABLE = 'pets';
const API_URL = `${SUPABASE_URL}/rest/v1/${TABLE}`;
const HEADERS = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

const lista_pets = () => {
    return fetch(`${API_URL}?select=*`,
        { headers: HEADERS })
        .then(res => {
            if (!res.ok) throw new Error('error en listar mascotas');
            return res.json();
        });
};

const crearPet = (nombre, raza, edad, cliente_id) => {
    if (!nombre || typeof nombre !== 'string') {
        throw new Error('El nombre es requerido y debe ser una cadena');
    }
    if (!raza || typeof raza !== 'string') {
        throw new Error('La raza es requerida y debe ser una cadena');
    }
    if (isNaN(edad) || edad <= 0) {
        throw new Error('La edad debe ser un número válido y mayor a 0');
    }
    if (!cliente_id) {
        throw new Error('El cliente_id es requerido');
    }

    const pet = {
        nombre,
        raza,
        edad: parseInt(edad),
        cliente_id,
        id: generarId()
    };
    console.log('Enviando a Supabase:', pet);
    return fetch(API_URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(pet)
    }).then(async (res) => {
        if (!res.ok) {
            const text = await res.text();
            console.error('Respuesta de error Supabase:', text);
            throw new Error(text || 'Error al crear la mascota');
        }
        const text = await res.text();
        return text ? JSON.parse(text) : pet;
    }).catch(err => {
        console.error(err || 'Error al crear la mascota');
        throw err;
    });
};

const eliminarPet = (id) => {                           // este se basa en la parte de "Delete a row" de Supabase
    return fetch(`${API_URL}?id=eq.${id}`, { // valor de entrada da referencia a eliminar
        method: 'DELETE',
        headers: HEADERS
    }).then(res => {
        if (!res.ok) throw new Error('Error al eliminar mascota');
        return res;
    }).catch((error) => {
        console.error('Error al eliminar mascota', error);
        throw error;
    });
};

const pet = (id) => {
    return fetch(`${API_URL}?id=eq.${id}`,
        { headers: HEADERS })
        .then(res => {
            if (!res.ok) {
                throw new Error('error en listar mascotas');
            }
            return res.json();
        });
};

const actualizarPet = (nombre, raza, edad, cliente_id, id) => {
    if (!id || !nombre || !raza || !edad || !cliente_id) {
        throw new Error('ID, nombre, raza, edad y cliente_id son requeridos');
    }
    console.log(`Actualizando mascota con ID: ${id}, Nombre: ${nombre}, Cliente ID: ${cliente_id}`);
    return fetch(`${API_URL}?id=eq.${id}`, {
        method: 'PATCH',
        headers: HEADERS,
        body: JSON.stringify({ nombre, raza, edad, cliente_id })
    })
        .then(async res => {
            if (!res.ok) {
                const text = await res.text();
                console.error('Respuesta de error:', text);
                throw new Error(text || 'Error al actualizar la mascota');
            }
            const data = await res.json();
            if (!data || (Array.isArray(data) && data.length === 0)) {
                throw new Error('No se encontró la mascota para actualizar o no se devolvieron datos');
            }
            return Array.isArray(data) ? data[0] : data;
        })
        .catch(err => {
            console.error('Error al actualizar la mascota:', err);
            throw err;
        });
};

export const petService = {
    lista_pets,
    crearPet,
    eliminarPet,
    pet,
    actualizarPet,
    generarId  
};