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
export default createTask;