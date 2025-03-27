const putData =()=>{
    const update={
        titulo:"Actualizado",
        descripcion: "Actualizado",
        fecha: new Date().toISOString()
    }
    fetch(`${API_URL}/1`,{
        method: 'PUT',
        headers:{
            "Content-Type":"application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(update)

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