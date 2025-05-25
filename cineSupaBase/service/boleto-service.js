function generarId() {
    return crypto.randomUUID();
}

const SUPABASE_URL = 'https://jxfzvczkarjvwgnxbedt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4Znp2Y3prYXJqdndnbnhiZWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MTkxODQsImV4cCI6MjA2MzQ5NTE4NH0.cmOx7WfIfB8rY3Bj-EamJ-UXmQlEDZ1alKJ7IK75hyA';
const TABLE = 'boleto';
const API_URL = `${SUPABASE_URL}/rest/v1/${TABLE}`;
const HEADERS = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

const lista_boletos = () => {
    return fetch(`${API_URL}?select=*`, {
        headers: HEADERS
    })
    .then(res => {
        if (!res.ok) throw new Error('Error al listar boletos');
        return res.json();
    });
};

const crearBoleto = (nro_asiento, id_programacion, id_cliente) => {
    const boleto = {
        nro_asiento: parseInt(nro_asiento),
        id_programacion,
        id_cliente,
        id: generarId()
    }
    return fetch(API_URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(boleto)
    }).then(async (res) => {
        if (!res.ok) {
            const text = await res.text(); 
            throw new Error(text || 'Error al crear el boleto');
        }
        const text = await res.text();
        return text ? JSON.parse(text) : boleto;
    }).catch(err => {
        console.error('Error al crear el boleto:', err);
        throw err;
    });
};

const eliminarBoleto = (id) => {                          
    return fetch(`${API_URL}?id=eq.${id}`, {
        method: 'DELETE',
        headers: HEADERS
    }).then(res => {
        if (!res.ok) throw new Error('Error al eliminar boleto');
        return res;
    }).catch((error) => {
        console.error('Error al eliminar boleto:', error);
        throw error;
    });
};

const boleto = (id) => {
    return fetch(`${API_URL}?id=eq.${id}`, 
        {headers: HEADERS})
    .then(res => {
        if (!res.ok) {
            throw new Error('Error al obtener boleto');
        }
        return res.json();
    })
};

const actualizarBoleto = (nro_asiento, id_programacion, id_cliente, id) => {
    return fetch(`${API_URL}?id=eq.${id}`, {
        method: 'PATCH',
        headers: HEADERS,
        body: JSON.stringify({ 
            nro_asiento: parseInt(nro_asiento), 
            id_programacion, 
            id_cliente 
        })
    })
    .then(async res => {
        if (!res.ok) {
            const text = await res.text();
            console.error('Respuesta de error:', text);
            throw new Error(text || 'Error al actualizar el boleto');
        }
        const data = await res.json();
        if (!data || (Array.isArray(data) && data.length === 0)) {
            throw new Error('No se encontró el boleto para actualizar o no se devolvieron datos');
        }
        return Array.isArray(data) ? data[0] : data;
    })
    .catch(err => {
        console.error('Error al actualizar el boleto:', err);
        throw err;
    });
};

export const boletoService = {
    lista_boletos,
    crearBoleto,
    eliminarBoleto,
    boleto,
    actualizarBoleto
};