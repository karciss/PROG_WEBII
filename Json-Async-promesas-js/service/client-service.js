/*const crear_nueva_fila=(nombre,email)=>{// recepciono datos 
    const fila = document.createElement('tr');// creo una nueva filla en la tabla
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
};x


const table = document.querySelector("[data-table]");
*/

/*const lista_clientes=()=>{ metodo antiguo
    const promesa= new Promise((resolve,reject)=>{
        const http = new XMLHttpRequest();//variable con request http y xml
        http.open("GET","http://localhost:3000/perfil");
        http.send();
        http.onload=()=>{
            const response = JSON.parse(http.response);//convierto que mi respuesta hhtp sea json
            if(http.response>=400){
                reject(response)
            } else{
                resolve(response)
            }
        };
    });
    return promesa;
}*/



/*
lista_clientes()
    .then((data)=>{
        data.forEach((perfil)=>{
            const nuevafila= crear_nueva_fila(perfil.nombre,perfil.email);
            table.appendChild(nuevafila)
        });
    })
    .catch((error)=> alert("No existe conexión"));

*/

//---------optimizado---------
const listaclientes=()=> fetch("http://localhost:3000/perfil").then((respuesta)=>respuesta.json());
const crearCliente=(nombre,email)=>{
    return fetch ("http://localhost:3000/perfil",{
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },
        body:JSON.stringify({nombre,email, id: uuid.v4()})
    });

};
const eliminarCliente=(id)=>{
    console.log("elii",id)
    return fetch(`http://localhost:3000/perfil/${id}`,{
        method:"DELETE"
    });

;}
// referencia a un cliente del json a travez de id
const clientes=(id)=>{
    return fetch(`http://localhost:3000/perfil/${id}`).then((respuesta)=>respuesta.json())}

const actualizarCliente=(nombre,email,id)=>{ // ojoooo solo actualizo nombre y email NO ID
    return fetch(`http://localhost:3000/perfil/${id}`,
        {
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({nombre,email})

        }).then(respuesta=>console.log(respuesta)).catch((err)=>console.log(err));
};



export const clientService={
    listaclientes,
    crearCliente,
    eliminarCliente,
    clientes,
    actualizarCliente
};

//json-server --watch Json-Async-promesas-js/db.json --port 3000