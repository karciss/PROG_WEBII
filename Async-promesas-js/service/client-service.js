/*function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

const API_BASE_URL = 'http://localhost/api1/conexion.php';

const lista_clientes = () => {
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

const crearCliente = (nombre, email) => {
    return fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, email, id: generarId() })
    }).then(response => {
        if (!response.ok) {
            throw new Error('Error al crear el cliente');
        }
        return response.json();
    });
};

const eliminarCliente = (id) => {
    return fetch(`${API_BASE_URL}?id=${id}`, {
        method: 'DELETE'
    }).then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar el cliente');
        }
        return response.json();
    });
};

const clientes = (id) => {
    return fetch(`${API_BASE_URL}?id=${id}`).then((respuesta) => respuesta.json());
};

const actualizarCliente = (nombre, email, id) => { 
    return fetch(API_BASE_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, email, id })
    }).then(respuesta => {
        if (!respuesta.ok) {
            throw new Error('Error al actualizar el cliente');
        }
        return respuesta.json();
    }).catch(err => {
        console.error(err);
        throw err;
    });
};

export const clientService = {
    lista_clientes,
    crearCliente,
    eliminarCliente,
    clientes,
    actualizarCliente
};*/


// SUPABASE MI VERSION
/*function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
const SUPABASE_URL = 'https://qixdcadprrreesrtoaky.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpeGRjYWRwcnJyZWVzcnRvYWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NzY5MDIsImV4cCI6MjA2MjQ1MjkwMn0.5MUi_Oi-VwvrtrwVqzFbzUmjJEi2D8mvIZNxZmkKfa4';
const TABLE = 'perfil';
const API_URL = `${SUPABASE_URL}/rest/v1/${TABLE}`; //me indica a que tabla quiero acceder
const HEADERS = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
}

const lista_clientes = () => {
    return fetch(`${API_URL}?select=*`,
        {headers:HEADERS})
    .then(res=>{
        if(!res.ok)throw new Error('error en listar clientes');
        return res.json();
    });
};

const crearCliente = (nombre, email) => {
    const cliente = {
        nombre,
        email,
        id: generarId()
    }
    return fetch(API_URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(cliente)
    }).then(async (res) => {
        if (!res.ok) {
            const text = await res.text(); // responde el error en texto 
            throw new Error(text || 'Error al crear el cliente');
        }
        const text = await res.text();
        return text ? JSON.parse(text) : cliente; // si todo esta bien devuelve el cliente creado
    }).catch(err => {
        console.error(err || 'Error al crear el cliente');
        throw err;
    });
}

const eliminarCliente=(id)=>{                           //este se basa en el supabes en la parte de "Delete a row"
    return fetch(`${API_URL}?id=eq.${id}`,{//valor de entrada da referencia a eliminar
        method:'DELETE',
        headers:HEADERS
    }).then(res=>{
        if(!res.ok)throw new Error('Error al eliminar cliente');
        return res;
    }).catch((error)=>{
        console.error('Error al eliminar cliente', error);
        throw error;
    });
};

const clientes = (id) => {
    return fetch(`${API_URL}?id=eq.${id}`, 
        {headers: HEADERS})
    .then(res => {
        if (!res.ok) {
            throw new Error('error en listar clientes');
        }
        return res.json();
    })
}

const actualizarCliente = (nombre, email, id) => {
    return fetch(`${API_URL}?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
            ...HEADERS,
            'Prefer': 'return=representation'
        },
        body: JSON.stringify({ nombre, email })
    }).then(async (res) => {
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || 'Error al actualizar el cliente');
        }
        const data = await res.json();
        if (!data || data.length === 0) {
            throw new Error('No se encontró el cliente para actualizar');
        }
        return data[0]; // Devuelve el cliente actualizado
    }).catch(err => {
        console.error(err || 'Error al actualizar el cliente');
        throw err;
    });
};

export const clientService = {
    lista_clientes,
    crearCliente,
    eliminarCliente,
    clientes,
    actualizarCliente
};*/

// SUPABASE CORREGIDO
/*function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
const SUPABASE_URL = 'https://qixdcadprrreesrtoaky.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpeGRjYWRwcnJyZWVzcnRvYWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NzY5MDIsImV4cCI6MjA2MjQ1MjkwMn0.5MUi_Oi-VwvrtrwVqzFbzUmjJEi2D8mvIZNxZmkKfa4';
const TABLE = 'perfil';
const API_URL = `${SUPABASE_URL}/rest/v1/${TABLE}`;
const HEADERS = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

const lista_clientes = () => {
    return fetch(`${API_URL}?select=*`,
        {headers:HEADERS})
    .then(res=>{
        if(!res.ok)throw new Error('error en listar clientes');
        return res.json();
    });
};

const crearCliente = (nombre, email) => {
    const cliente = {
        nombre,
        email,
        id: generarId()
    }
    return fetch(API_URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(cliente)
    }).then(async (res) => {
        if (!res.ok) {
            const text = await res.text(); // responde el error en texto 
            throw new Error(text || 'Error al crear el cliente');
        }
        const text = await res.text();
        return text ? JSON.parse(text) : cliente; // si todo esta bien devuelve el cliente creado
    }).catch(err => {
        console.error(err || 'Error al crear el cliente');
        throw err;
    });
};

const eliminarCliente=(id)=>{                           //este se basa en el supabes en la parte de "Delete a row"
    return fetch(`${API_URL}?id=eq.${id}`,{//valor de entrada da referencia a eliminar
        method:'DELETE',
        headers:HEADERS
    }).then(res=>{
        if(!res.ok)throw new Error('Error al eliminar cliente');
        return res;
    }).catch((error)=>{
        console.error('Error al eliminar cliente', error);
        throw error;
    });
};

const clientes = (id) => {
    return fetch(`${API_URL}?id=eq.${id}`, 
        {headers: HEADERS})
    .then(res => {
        if (!res.ok) {
            throw new Error('error en listar clientes');
        }
        return res.json();
    })
};

const actualizarCliente = (nombre, email, id) => {
    if (!id || !nombre || !email) {
        throw new Error('ID, nombre y email son requeridos');
    }
    console.log(`Actualizando cliente con ID: ${id}, Nombre: ${nombre}, Email: ${email}`);
    return fetch(`${API_URL}?id=eq.${id}`, {
        method: 'PATCH',
        headers: HEADERS,
        body: JSON.stringify({ nombre, email })
    })
    .then(async res => {
        if (!res.ok) {
            const text = await res.text();
            console.error('Respuesta de error:', text);
            throw new Error(text || 'Error al actualizar el cliente');
        }
        const data = await res.json();
        if (!data || (Array.isArray(data) && data.length === 0)) {
            throw new Error('No se encontró el cliente para actualizar o no se devolvieron datos');
        }
        return Array.isArray(data) ? data[0] : data;
    })
    .catch(err => {
        console.error('Error al actualizar el cliente:', err);
        throw err;
    });
};

export const clientService = {
    lista_clientes,
    crearCliente,
    eliminarCliente,
    clientes,
    actualizarCliente
};*/


// SUPABASE CON BUSQUEDA
function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

const SUPABASE_URL = 'https://qixdcadprrreesrtoaky.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpeGRjYWRwcnJyZWVzcnRvYWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NzY5MDIsImV4cCI6MjA2MjQ1MjkwMn0.5MUi_Oi-VwvrtrwVqzFbzUmjJEi2D8mvIZNxZmkKfa4';
const TABLE = 'perfil';
const API_URL = `${SUPABASE_URL}/rest/v1/${TABLE}`;
const HEADERS = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

const lista_clientes = () => {
    return fetch(`${API_URL}?select=*`, { headers: HEADERS })
        .then(res => {
            if (!res.ok) throw new Error('error en listar clientes');
            return res.json();
        });
};

const buscarClientes = (termino) => {
    if (!termino) {
        return lista_clientes();
    }
    // Usamos or para buscar en nombre o email
    const query = `or=(nombre.ilike.*${encodeURIComponent(termino)}*,email.ilike.*${encodeURIComponent(termino)}*)`;
    const url = `${API_URL}?select=*&${query}`;
    return fetch(url, { headers: HEADERS })
        .then(res => {
            if (!res.ok) {
                throw new Error('Error al buscar clientes');
            }
            return res.json();
        })
        .catch(err => {
            console.error('Error al buscar clientes:', err);
            throw err;
        });
};

const crearCliente = (nombre, email) => {
    const cliente = {
        nombre,
        email,
        id: generarId()
    };
    return fetch(API_URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(cliente)
    }).then(async (res) => {
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || 'Error al crear el cliente');
        }
        const text = await res.text();
        return text ? JSON.parse(text) : cliente;
    }).catch(err => {
        console.error(err || 'Error al crear el cliente');
        throw err;
    });
};

const eliminarCliente = (id) => {
    return fetch(`${API_URL}?id=eq.${id}`, {
        method: 'DELETE',
        headers: HEADERS
    }).then(res => {
        if (!res.ok) throw new Error('Error al eliminar cliente');
        return res;
    }).catch((error) => {
        console.error('Error al eliminar cliente', error);
        throw error;
    });
};

const clientes = (id) => {
    return fetch(`${API_URL}?id=eq.${id}`, { headers: HEADERS })
        .then(res => {
            if (!res.ok) {
                throw new Error('error en listar clientes');
            }
            return res.json();
        });
};

const actualizarCliente = (nombre, email, id) => {
    if (!id || !nombre || !email) {
        throw new Error('ID, nombre y email son requeridos');
    }
    console.log(`Actualizando cliente con ID: ${id}, Nombre: ${nombre}, Email: ${email}`);
    return fetch(`${API_URL}?id=eq.${id}`, {
        method: 'PATCH',
        headers: HEADERS,
        body: JSON.stringify({ nombre, email })
    })
    .then(async res => {
        if (!res.ok) {
            const text = await res.text();
            console.error('Respuesta de error:', text);
            throw new Error(text || 'Error al actualizar el cliente');
        }
        const data = await res.json();
        if (!data || (Array.isArray(data) && data.length === 0)) {
            throw new Error('No se encontró el cliente para actualizar o no se devolvieron datos');
        }
        return Array.isArray(data) ? data[0] : data;
    })
    .catch(err => {
        console.error('Error al actualizar el cliente:', err);
        throw err;
    });
};

export const clientService = {
    lista_clientes,
    buscarClientes, 
    crearCliente,
    eliminarCliente,
    clientes,
    actualizarCliente
};