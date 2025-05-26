import { boletoService } from "../service/boleto-service.js";
import { clientService } from "../service/client-service.js";
import { programacionService } from "../service/programacion-service.js";
import { movieService } from "../service/movie-service.js";
import { salaService } from "../service/sala-service.js";

const formulario = document.querySelector("[data-form]");
const programacionSelect = document.querySelector("[data-programacion]");
const clienteSelect = document.querySelector("[data-cliente]");

const cargarSelects = async () => {
    try {        const programaciones = await programacionService.lista_programaciones();
        const peliculas = await movieService.lista_peliculas();
        const salas = await salaService.lista_salas();
        
        programaciones.forEach(prog => {
            const pelicula = peliculas.find(p => p.id === prog.id_pelicula);
            const sala = salas.find(s => s.id === prog.id_sala);
            const option = document.createElement("option");
            option.value = prog.id;
            option.textContent = `Película: ${pelicula ? pelicula.nombre : 'N/A'} - Sala: ${sala ? `Sala ${sala.nro_sala}` : 'N/A'} - Fecha: ${prog.fecha} - Hora: ${prog.hora_inicio}`;
            programacionSelect.appendChild(option);
        });

        const clientes = await clientService.lista_clientes();
        clientes.forEach(cliente => {
            const option = document.createElement("option");
            option.value = cliente.id;
            option.textContent = `${cliente.nombre} ${cliente.apellido || ''}`;
            clienteSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        alert("Error al cargar los datos: " + error.message);
    }
};


cargarSelects();

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const nro_asiento = document.querySelector("[data-nro_asiento]").value.trim();
    const id_programacion = programacionSelect.value;
    const id_cliente = clienteSelect.value;

    if (!nro_asiento) {
        alert("El número de asiento es requerido");
        return;
    }

    if (!id_programacion) {
        alert("Debe seleccionar una programación");
        return;
    }

    if (!id_cliente) {
        alert("Debe seleccionar un cliente");
        return;
    }

    boletoService.crearBoleto(nro_asiento, id_programacion, id_cliente)
        .then(() => {
            window.location.href = "../screens/registro_completado_boleto.html";
        })
        .catch((error) => {
            console.error("Error al registrar el boleto:", error);
            alert("Error al registrar el boleto: " + error.message);
            window.location.href = "../screens/error.html";
        });
});
