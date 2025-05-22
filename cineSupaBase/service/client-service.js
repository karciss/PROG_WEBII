
function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
const SUPABASE_URL = 'https://jxfzvczkarjvwgnxbedt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4Znp2Y3prYXJqdndnbnhiZWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MTkxODQsImV4cCI6MjA2MzQ5NTE4NH0.cmOx7WfIfB8rY3Bj-EamJ-UXmQlEDZ1alKJ7IK75hyA';
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

const crearCliente = (nombre, apellido, edad, telefono) => {
    const cliente = {
        nombre,
        apellido,
        edad: parseInt(edad),
        telefono,
        id: generarId()
    }
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

const eliminarCliente=(id)=>{                          
    return fetch(`${API_URL}?id=eq.${id}`,{
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

const actualizarCliente = (nombre, apellido, edad, telefono, id) => {
    
    return fetch(`${API_URL}?id=eq.${id}`, {
        method: 'PATCH',
        headers: HEADERS,
        body: JSON.stringify({ nombre, apellido, edad, telefono })
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
};