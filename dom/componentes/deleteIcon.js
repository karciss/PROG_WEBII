const deleteIcon =() => {
    const i = document.createElement('i');
    i.classList.add('fas','fa-trash-alt','trashIcon','icon');
    i.addEventListener('click',eliminarTarea);
    return i;
}
const eliminarTarea=(evento)=>{
    const parent = evento.target.parentElement;
    parent.remove();
    alert("Acabas de eliminar una tarea");
}

export default deleteIcon;