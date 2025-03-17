const checkComplete = () => {
    const i = document.createElement('i');   //creamos un icono
    i.classList.add("far", "fa-check-square", "icon");   //dando estilo al icono
    i.addEventListener('click', color)
    
    return i;
}

const color = (evento) => {
    const element = evento.target;
    const checked = element.classList.contains('fas');
    if(checked){
        element.classList.remove('fas','completeIcon');
        element.classList.add('far');
    }
    else{
        element.classList.remove('far')
        element.classList.add('fas','completeIcon');
    }
    
    // element.classList.add('fas');
    // element.classList.add('completeIcon');
    // element.classList.remove('far');
}

export default checkComplete;