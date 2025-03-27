const postData =()=>{
    //aqui se crea la nueva variable q tenga un objeto con la estrucutra para insertar a la base de datos
    const newPost={
        titulo:"Nuevo post",
        descripcion: "Nueva descripcion",
        fecha: new Date().toISOString()
    };
    //el fetch solo mantiene durante la accion abierta la conexion con el servidor
    //agregamos datos a la bd
    fetch(API_URL,{
        method: 'POST',
        headers:{
            "Content-Type":"application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(newPost)
    })
    .then(response =>{
        if(!response.ok){
            throw new Error(`error en la peticion el estado es: ${response.status}`)
        }
        return response.json();
    })
    .then (data=>showResult(data))
    .catch(error=>showResult(error.message,true));

};