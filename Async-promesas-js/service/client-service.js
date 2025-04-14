const crear_nueva_fila = (nombre,email) =>{
    const fila = document.createElement('tr'); //creo una nueva fila en la tabla 
    //guardo el contenido de la fila en una variable llamando a las variables nombre y email 
    const contenido =`
            <td class="td" data-td>${nombre}</td>
            <td>${email}</td>
            <td>
              <ul class="table__button-control">
                <li>
                  <a
                    href="../screens/editar_cliente.html"
                    class="simple-button simple-button--edit"
                    >Editar</a
                  >
                </li>
                <li>
                  <button
                    class="simple-button simple-button--delete"
                    type="button"
                  >
                    Eliminar
                  </button>
                </li>
              </ul>
            </td>`;
            fila.innerHTML = contenido; //agrego el contenido a la fila
            return fila;

};

const tabla = document.querySelector('[data-table]'); 
const lista_clientes = () =>{
    const promise = new Promise((resolve,reject)=>{
        const http = new XMLHttpRequest(); //creo una nueva peticion http
        http.open('GET','http://localhost:3000/perfil'); //abro la peticion http
        http.send(); //envio la peticion http
        http.onload = () => {
            const response = JSON.parse(http.response); //convierto que mi respuesta http a json
            if(http.status >= 400){ 
                reject(response); 
            }else{
                resolve(response); 
            }
        };
        
    });
    return promise;

};
lista_clientes()
    .then(data => {
        data.forEach(perfil => {
            const nuevaFila = crear_nueva_fila(perfil.nombre,perfil.email); //creo una nueva fila con los datos del cliente
            tabla.appendChild(nuevaFila); //agrego la nueva fila a la tabla
        });
    })
    .catch(err => alert('Ocurrio un error')) //si hay un error muestro un mensaje de error