import createTask from "./components/createTask.js";
import tacharUltimo from "./components/tacharUltimo.js";
import contarItems from "./components/contarItems.js";


//crear tarea en la lista
const btn = document.querySelector('[data-addBtn]')
btn.addEventListener('click', createTask);


//aplicar clase relleno
const list = document.querySelector('[data-list]')
list.addEventListener('click', (evento) => {
    if(evento.target.tagName === 'LI') {
        evento.target.classList.toggle('relleno')
    }
});


//tachar ultimo 
const toggleBtn = document.querySelector('[data-toggleBtn]')
toggleBtn.addEventListener('click', tacharUltimo);


//contar items
const countBtn = document.querySelector('[data-countBtn]')
countBtn.addEventListener('click',contarItems);


//eliminar con doble click
list.addEventListener('dblclick', (evento) => {
    if(evento.target.tagName === 'LI') {
        evento.target.remove()
    }
});