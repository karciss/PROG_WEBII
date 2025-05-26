import { boletoService } from "../service/boleto-service.js";
import { clientService } from "../service/client-service.js";
import { programacionService } from "../service/programacion-service.js";
import { movieService } from "../service/movie-service.js";
import { salaService } from "../service/sala-service.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

if (!id) {
    alert("No se proporcionó un ID de boleto");
    window.location.href = "../screens/lista_boleto.html";
}

const form = document.querySelector("[data-form]");
const nroAsientoInput = document.querySelector("[data-nro_asiento]");
const programacionSelect = document.querySelector("[data-programacion]");
const clienteSelect = document.querySelector("[data-cliente]");

const cargarProgramaciones = async () => {
    try {
        programacionSelect.innerHTML = '<option value="">Seleccione una programación</option>';        const programaciones = await programacionService.lista_programaciones();
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
    } catch (error) {
        console.error("Error al cargar programaciones:", error);
        alert("Error al cargar las programaciones disponibles: " + error.message);
    }
};

const cargarClientes = async () => {
    try {
        clienteSelect.innerHTML = '<option value="">Seleccione un cliente</option>';
        const clientes = await clientService.lista_clientes();
        clientes.forEach(cliente => {
            const option = document.createElement("option");
            option.value = cliente.id;
            option.textContent = `${cliente.nombre} ${cliente.apellido || ''}`;
            clienteSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar clientes:", error);
        alert("Error al cargar la lista de clientes: " + error.message);
    }
};

const inicializarFormulario = async () => {
    try {
        await cargarProgramaciones();
        await cargarClientes();

        const boletosArr = await boletoService.boleto(id);
        const boleto = Array.isArray(boletosArr) ? boletosArr[0] : boletosArr;
        
        if (!boleto) {
            alert("Boleto no encontrado");
            window.location.href = "../screens/lista_boleto.html";
            return;
        }

        nroAsientoInput.value = boleto.nro_asiento || "";
        programacionSelect.value = boleto.id_programacion || "";
        clienteSelect.value = boleto.id_cliente || "";

        if (programacionSelect.value !== boleto.id_programacion) {
            console.warn("Programación no encontrada en la lista");
        }
        if (clienteSelect.value !== boleto.id_cliente) {
            console.warn("Cliente no encontrado en la lista");
        }
    } catch (error) {
        console.error("Error al inicializar el formulario:", error);
        alert("Error al cargar los datos del formulario: " + error.message);
        window.location.href = "../screens/lista_boleto.html";
    }
};

inicializarFormulario();

form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const nro_asiento = nroAsientoInput.value.trim();
    const id_programacion = programacionSelect.value;
    const id_cliente = clienteSelect.value;

    if (!nro_asiento || isNaN(nro_asiento) || parseInt(nro_asiento) <= 0) {
        alert("El número de asiento debe ser un número válido y mayor a 0");
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

    try {
        await boletoService.actualizarBoleto(nro_asiento, id_programacion, id_cliente, id);
        window.location.href = "../screens/edicion_concluida.html";
    } catch (error) {
        console.error("Error al actualizar el boleto:", error);
        alert("Error al actualizar el boleto: " + error.message);
        window.location.href = "../screens/error.html";
    }
});
