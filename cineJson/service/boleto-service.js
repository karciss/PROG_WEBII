const API_URL= 'http://localhost:3000/boleto';

const lista_boletos = () => 
    fetch(API_URL).then((respuesta) => respuesta.json());

const boleto = (id) => 
    fetch(`${API_URL}/${id}`).then((respuesta) => respuesta.json());

const crearBoleto = (nro_asiento, id_programacion, id_cliente) => {
    return fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: uuid.v4(),
            nro_asiento: parseInt(nro_asiento),
            id_programacion,
            id_cliente
        })
    });
};

const actualizarBoleto = (nro_asiento, id_programacion, id_cliente, id) => {
    return fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nro_asiento: parseInt(nro_asiento),
            id_programacion,
            id_cliente
        })
    });
};

const eliminarBoleto = (id) => {
    return fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
};

export const boletoService = {
    lista_boletos,
    boleto,
    crearBoleto,
    actualizarBoleto,
    eliminarBoleto
};