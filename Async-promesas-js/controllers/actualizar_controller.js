import { clientService } from "../service/client-service.js";

const formulario = document.querySelector("[data-form]");
const obtenerInfo = () => {
    const url = new URL(window.location); //obtengo la url de la pagina
    const id = (url.searchParams.get("id")); //obtengo el id de la url
    if (!id) {
        window.location.href = "../screens/error.html"; //si no hay id me redirige a error
    }
    const nombre = document.querySelector("[data-nombre]");
    const email = document.querySelector("[data-email]");
    
    clientService.clientes(id).then((perfil) => { 

        nombre.value = perfil.nombre; //seteo el nombre y el email en el formulario
        email.value = perfil.email;
    });

};
obtenerInfo();

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const url = new URL(window.location); //obtengo la url de la pagina
    const id = (url.searchParams.get("id")); //obtengo el id de la url

    const nombre = document.querySelector("[data-nombre]").value;
    const email = document.querySelector("[data-email]").value;
    clientService.actualizarCliente(nombre, email, id).then((respuesta) => { 
        window.location.href = "../screens/edicion_concluida.html"; 
    }).catch((error) => { 
        alert("Ocurrio un error"); 
    });
});
