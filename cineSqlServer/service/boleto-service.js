function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

const API_BASE_URL = 'http://localhost/apiSql/boleto.php';

const lista_boletos = () => {
    return fetch(API_BASE_URL)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Error al obtener los boletos:', error);
            throw error;
        });
};

const crearBoleto = (nro_asiento, id_programacion, id_cliente) => {
    return fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: generarId(),
            nro_asiento: parseInt(nro_asiento),
            id_programacion,
            id_cliente
        })
    }).then(response => {
        if (!response.ok) {
            throw new Error('Error al crear el boleto');
        }
        return response.json();
    });
};

const eliminarBoleto = (id) => {
    return fetch(`${API_BASE_URL}?id=${id}`, {
        method: 'DELETE'
    }).then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar el boleto');
        }
        return response.json();
    });
};

const boleto = (id) => {
    return fetch(`${API_BASE_URL}?id=${id}`)
        .then((respuesta) => {
            if (!respuesta.ok) {
                throw new Error('Error al obtener el boleto');
            }
            return respuesta.json();
        });
};

const actualizarBoleto = (nro_asiento, id_programacion, id_cliente, id) => {
    return fetch(API_BASE_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nro_asiento: parseInt(nro_asiento),
            id_programacion,
            id_cliente,
            id
        })
    }).then(respuesta => {
        if (!respuesta.ok) {
            throw new Error('Error al actualizar el boleto');
        }
        return respuesta.json();
    }).catch(err => {
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