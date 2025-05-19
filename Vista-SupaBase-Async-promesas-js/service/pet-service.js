function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

const SUPABASE_URL = 'https://qixdcadprrreesrtoaky.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpeGRjYWRwcnJyZWVzcnRvYWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NzY5MDIsImV4cCI6MjA2MjQ1MjkwMn0.5MUi_Oi-VwvrtrwVqzFbzUmjJEi2D8mvIZNxZmkKfa4';
const HEADERS = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

const API_URL_PETS = `${SUPABASE_URL}/rest/v1/pets`;
const API_URL_PETS_WITH_VIEW = `${SUPABASE_URL}/rest/v1/pets_with_owner`;

const lista_pets = (useView = false) => {
    const url = useView ? `${API_URL_PETS_WITH_VIEW}?select=*` : `${API_URL_PETS}?select=*,perfil(nombre,email)`;
    return fetch(url, { headers: HEADERS })
        .then(res => {
            if (!res.ok) throw new Error('error en listar mascotas');
            return res.json();
        });
};

const buscarPets = (termino, useView = false) => {
    if (!termino) {
        return lista_pets(useView);
    }
    
    let url;
    if (useView) {
        url = `${API_URL_PETS_WITH_VIEW}?select=*&or=%28pet_nombre.ilike.*${encodeURIComponent(termino)}*,owner_nombre.ilike.*${encodeURIComponent(termino)}*%29`;
    } else {
        url = `${API_URL_PETS}?select=*,perfil(nombre,email)&or=%28nombre.ilike.*${encodeURIComponent(termino)}*,perfil.nombre.ilike.*${encodeURIComponent(termino)}*%29`;
    }
    
    return fetch(url, { headers: HEADERS })
        .then(res => {
            if (!res.ok) throw new Error('Error al buscar pets');
            return res.json();
        })
        .catch(err => {
            console.error('Error al buscar pets:', err);
            throw err;
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
    
    return fetch(API_URL_PETS, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(pet)
    }).then(async (res) => {
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || 'Error al crear la mascota');
        }
        const text = await res.text();
        return text ? JSON.parse(text) : pet;
    }).catch(err => {
        console.error(err || 'Error al crear la mascota');
        throw err;
    });
};

const eliminarPet = (id) => {
    return fetch(`${API_URL_PETS}?id=eq.${id}`, {
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
    return fetch(`${API_URL_PETS}?id=eq.${id}`, { headers: HEADERS })
        .then(res => {
            if (!res.ok) throw new Error('error en listar mascotas');
            return res.json();
        });
};

const actualizarPet = (nombre, raza, edad, cliente_id, id) => {
    if (!id || !nombre || !raza || !edad || !cliente_id) {
        throw new Error('ID, nombre, raza, edad y cliente_id son requeridos');
    }
    
    return fetch(`${API_URL_PETS}?id=eq.${id}`, {
        method: 'PATCH',
        headers: HEADERS,
        body: JSON.stringify({ nombre, raza, edad, cliente_id })
    })
        .then(async res => {
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Error al actualizar la mascota');
            }
            const data = await res.json();
            if (!data || (Array.isArray(data) && data.length === 0)) {
                throw new Error('No se encontró la mascota para actualizar');
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
    buscarPets,
    crearPet,
    eliminarPet,
    pet,
    actualizarPet,
    generarId
};