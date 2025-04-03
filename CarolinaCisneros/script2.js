

//no modular 

//crear tarea en la lista
const btn = document.querySelector('[data-addBtn]')

const createTask = (evento) => {
    evento.preventDefault(); 
    const input = document.querySelector('[data-input-item]')
    const value = input.value;

    if(value === '') {
        alert('Ingrese una tarea, el campo no puede estar vacio')
        return
    }

    const list = document.querySelector('[data-list]')
    const task = document.createElement('li')
    task.classList.add('task')
    input.value = '';

    const contTask = document.createElement('div');     
    const titleTask = document.createElement('span');
    titleTask.classList.add('task');
    titleTask.innerText = value;

    task.appendChild(titleTask);
    list.appendChild(task);


}
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
toggleBtn.addEventListener('click', (evento) => {
    evento.preventDefault();
    const items = list.querySelectorAll('li')
    if(items.length === 0) {
        alert('No hay tareas para tachar')
        return
    }
    const lastItem = items[items.length - 1]
    lastItem.classList.add('tachado')
});


//contar items
const countBtn = document.querySelector('[data-countBtn]')
countBtn.addEventListener('click', (evento) => {
    evento.preventDefault();
    const items = list.querySelectorAll('li')
    const count = items.length
    const output = document.querySelector('[data-output]')
    output.innerText = `Total de tareas: ${count}`

});


//eliminar con doble click
list.addEventListener('dblclick', (evento) => {
    if(evento.target.tagName === 'LI') {
        evento.target.remove()
    }
});