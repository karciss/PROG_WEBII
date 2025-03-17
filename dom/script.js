import checkComplete from "./componentes/checkComplete.js";
import deleteIcon from "./componentes/deleteIcon.js";


const btn = document.querySelector('[data-form-btn]')

// console.log(btn);

// funcion para recuperar texto de un input
const createTask=(evento)=>{
    evento.preventDefault();//los valores por defecto
    const input= document.querySelector('[data-form-input]')
    console.log(input.value);
    const value = input.value;
    const list = document.querySelector('[data-list]')
    const task = document.createElement('li')
    task.classList.add('card')
    input.value = '';
    // const contenido = `<div>
    //         <i class="far fa-check-square icon"></i>
    //         <span class="task">${value}</span>
    //         </div>
    //         <i class="fas fa-trash-alt trashIcon icon"></i>
    // `

    const contTask = document.createElement('div');     //creamos un elemento div
    const titleTask = document.createElement('span');    //creamos un elemento span

    titleTask.classList.add('task');    //classList es para agregar clases
    titleTask.innerText = value;    //innerText es para agregar texto

    contTask.appendChild(checkComplete());    //agrego check al div
    contTask.appendChild(titleTask);    //appendChild es para agregar un hijo a un padre
    const content = `<i class="fas fa-trash-alt trashIcon icon"></i>`

    task.appendChild(contTask);
    task.appendChild(deleteIcon());
    // task.innerHTML = contenido;
    list.appendChild(task);
    // console.log(contenido);
    alert("Acabas de crear una tarea");
}

btn.addEventListener('click', createTask);




// const checkComplete = () => {
//     const i = document.createElement('i'); //creamos un icono
//     i.classList.add("far", "fa-check-square", "icon"); //dando estilo al icono
//     i.addEventListener('click', color)

//     return i;
// }

// const color = (evento) => {
//     const element = evento.target;
//     element.classList.add('fa');
//     element.classList.add('completeIcon');
//     element.classList.remove('far');
// }



// const deleteIcon =() => {
//     const i = document.createElement('i');
//     i.classList.add('fast','fa-trash-alt','trashIcon','icon');
//     i.addEventListener('click',eliminarTarea);
//     return i;
// }
// const eliminarTarea=(evento)=>{
//     const parent = evento.target.parentElement;
//     parent.remove();
// }

