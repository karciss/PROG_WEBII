/*const crear_nueva_fila=(nombre,email)=>{ //recepciono datos
    const fila = document.createElement('tr') //creo una nueva fila en la tabla
    //guardo html en una variable y tambien llamo a mis datos de entrada
    const contenido = `
            <td class="td" data-td>
            ${nombre}
            </td>
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
            </td>
            `;
        fila.innerHTML=contenido;
        return fila;
};

const table = document.querySelector("[data-table]");*/

//esta es la primera promesa que hicimos en clase pero la comentamos ya que usamos el fetch
/*const lista_clientes=()=>{                                  //metodo antiguo
    const promesa= new Promise((resolve,reject)=>{
        const http = new XMLHttpRequest();                    //variable con request http y xml
        http.open("GET","http://localhost:3000/perfil");
        http.send();
        http.onload=()=>{
            const response = JSON.parse(http.response);       //convierto que mi respuesta http sea json
            if(http.response>=400){
                reject(response)
            } else{
                resolve(response)
            }
        };
    });
    return promesa;
}*/

const listaclientes=()=>fetch("http://localhost:3000/perfil").then(respuesta=>respuesta.json());

/*lista_clientes()
    .then((data)=>{ //en caso de que todo este bien
        data.forEach((perfil)=>{
            const nuevafila= crear_nueva_fila(perfil.nombre,perfil.email);
            table.appendChild(nuevafila)
        });
    })
    .catch((error)=> alert("No existe conexion")); //en caso de que no funcione*/


const crearCliente = (nombre, email) =>{
  return fetch ("http://localhost:3000/perfil",{
    method: "POST",
    headers:{
        "Content-Type": "application/json"
    },
    body: JSON.stringify({nombre,email, id: uuid.v4()})
  })
};

const eliminarCliente = (id) =>{
  return fetch(`http://localhost:3000/perfil/${id}`,{
    method: "DELETE",
    headers:{
        "Content-Type": "application/json"
    },
  })
};

//recuperar los datos
const clientes =(id) => {
  return fetch(`http://localhost:3000/perfil/${id}`).then(respuesta => respuesta.json());
};

const actualizarCliente = (nombre,email,id) => {
  return fetch(`http://localhost:3000/perfil/${id}`,{
    method: "PUT",
    headers:{
        "Content-Type": "application/json"
    },
    body: JSON.stringify({nombre,email})
  }).then(respuesta => console.log(respuesta)).catch(error => console.log(error));

}


export const clientService={
  listaclientes,
  crearCliente,
  eliminarCliente,
  clientes,
  actualizarCliente

};