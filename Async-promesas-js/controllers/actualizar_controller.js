
//
/*const obtenerInfo=()=>{
    const url = new URL(window.location);
    const id = (url.searchParams.get('id'));
    if(id==null){
        window.location.href="../screens/error.html"
    }
    const nombre =document.querySelector("[data-nombre]")
    const email = document.querySelector("[data-email]")

clientService.clientes(id).then((perfil)=>{
    nombre.value=perfil.nombre;
    email.value=perfil.email;
});
    
};

obtenerInfo();
*/
//obtener informacion con async
//----------------- Nuevo Obtener Info ------------- con async
import { clientService } from "../service/client-service.js";

const obtenerInfo = async () => {
    const url = new URL(window.location);
    const id = url.searchParams.get("id");

    if (!id) {
        console.error("No se proporcionó un ID en la URL");
        window.location.href = "../screens/error.html";
        return;
    }

    const nombre = document.querySelector("[data-nombre]");
    const email = document.querySelector("[data-email]");

    try {
        console.log(`Buscando cliente con ID: ${id}`); // Depuración
        const perfilResponse = await clientService.clientes(id);
        console.log("Respuesta de clientService.clientes:", perfilResponse); // Depuración

        // Supabase devuelve un array, tomamos el primer elemento (si existe)
        const perfil = Array.isArray(perfilResponse) && perfilResponse.length > 0 ? perfilResponse[0] : perfilResponse;

        if (!perfil || !perfil.nombre || !perfil.email) {
            throw new Error("Cliente no encontrado o datos incompletos");
        }

        nombre.value = perfil.nombre;
        email.value = perfil.email;
    } catch (error) {
        console.error("Error al obtener el cliente:", error);
        window.location.href = "../screens/error.html";
    }
};

obtenerInfo();

const formulario = document.querySelector("[data-form]");
formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const url = new URL(window.location);
    const id = url.searchParams.get("id");

    const nombre = document.querySelector('[data-nombre]').value;
    const email = document.querySelector('[data-email]').value;

    console.log(`Actualizando cliente con ID: ${id}, Nombre: ${nombre}, Email: ${email}`); // Depuración
    clientService.actualizarCliente(nombre, email, id)
        .then(() => {
            window.location.href = "../screens/edicion_concluida.html";
        })
        .catch(error => {
            console.error("Error al actualizar el cliente:", error);
            window.location.href = "../screens/error.html";
        });
});