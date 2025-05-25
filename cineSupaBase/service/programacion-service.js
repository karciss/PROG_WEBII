const generarId = () => crypto.randomUUID();
const SUPABASE_URL= 'https://jxfzvczkarjvwgnxbedt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4Znp2Y3prYXJqdndnbnhiZWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MTkxODQsImV4cCI6MjA2MzQ5NTE4NH0.cmOx7WfIfB8rY3Bj-EamJ-UXmQlEDZ1alKJ7IK75hyA';
const TABLE = 'programacion';
const API_URL = `${SUPABASE_URL}/rest/v1/${TABLE}`;
const HEADERS = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};


const lista_programaciones = () => {
    return fetch(`${API_URL}?select=*`, { headers: HEADERS })
        .then(async res => {
            if (!res.ok) throw new Error('Error al listar programaciones');
            const programaciones = await res.json();
            
            //formatear los datos recibidos
            return programaciones.map(prog => ({
                ...prog,
                hora_inicio: prog.hora_inicio ? prog.hora_inicio.trim() : '',
                hora_fin: prog.hora_fin ? prog.hora_fin.trim() : ''
            }));
        })
        .catch(error => {
            console.error('Error al listar programaciones:', error);
            throw error;
        });
};


const crearProgramacion = (fecha, hora_inicio, hora_fin, id_pelicula, id_sala) => {
    if (!hora_inicio) throw new Error('La hora de inicio es requerida');
    if (!hora_fin) throw new Error('La hora de fin es requerida');

    const programacion = {
        fecha,
        hora_inicio: hora_inicio.trim(),
        hora_fin: hora_fin.trim(),
        id_pelicula,
        id_sala,
        id: generarId()
    };

    return fetch(API_URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(programacion)
    }).then(async (res) => {
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || 'Error al crear la programación');
        }
        const text = await res.text();
        return text ? JSON.parse(text) : programacion;
    }).catch(err => {
        console.error('Error al crear la programación:', err);
        throw err;
    });
};


const eliminarProgramacion = (id) => {
    return fetch(`${API_URL}?id=eq.${id}`, {
        method: 'DELETE',
        headers: HEADERS
    }).then(res => {
        if (!res.ok) throw new Error('Error al eliminar programación');
        return res;
    }).catch((error) => {
        console.error('Error al eliminar programación', error);
        throw error;
    });
};


const programacion = (id) => {
    return fetch(`${API_URL}?id=eq.${id}`, { headers: HEADERS })
        .then(res => {
        if (!res.ok) {
            throw new Error('error en listar las programaciones');
        }
        return res.json();
    })
};


const actualizarProgramacion = (fecha, hora_inicio, hora_fin, id_pelicula, id_sala, id) => {
    return fetch(`${API_URL}?id=eq.${id}`, {
        method: 'PATCH',
        headers: HEADERS,
        body: JSON.stringify({ fecha, hora_inicio, hora_fin, id_pelicula, id_sala })
    })
        .then(async res => {
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Error al actualizar la programación');
            }
            const data = await res.json();
            if (!data || (Array.isArray(data) && data.length === 0)) {
                throw new Error('No se encontró la programación para actualizar o no se devolvieron datos');
            }
            return Array.isArray(data) ? data[0] : data;
        })
        .catch(err => {
            console.error('Error al actualizar la programación:', err);
            throw err;
        });
};


export const programacionService = {
    lista_programaciones,
    crearProgramacion,
    eliminarProgramacion,
    programacion,
    actualizarProgramacion
};