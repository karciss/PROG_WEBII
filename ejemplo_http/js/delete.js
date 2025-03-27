const deleteData=()=>{
    fetch(`${API_URL}/1`, {
        method: 'DELETE'
    })
    .then(response =>{
        if(!response.ok){
            throw new Error(`error en la peticion el estado es: ${response.status}`)
        }
        showResult({
            message: "El registro se ha eliminado correctamente",
            status: response.status
        });
    })
    .catch(error=>showResult(error.message,true));
    
};