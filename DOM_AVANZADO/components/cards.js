// import tabla from './tabla.js';

// const cards = (()=>{
//     const taskCards = document.getElementById('taskCards');

//     const update = ()=>{
//         const tasks = tabla.getTask();

//         taskCards.innerHTML = ''; //limpio las cards refrescando

//         //creo yo (Giam) las cards por cada tarea
//         tasks.forEach(task =>{
//             const card = document.createElement('div');
//             card.className = 'taskCard';
//             card.innerHTML =  `
//                 <p><strong>Nombre:</strong> ${task.task}</p>
//                 <p><strong>Descripcion:</strong> ${task.description}</p>
//                 <p><strong>Fecha:</strong> ${task.date}</p>
//                 <p><strong>Prioridad:</strong> ${task.prioridad}</p>
//                 <p><strong>estado:</strong> ${task.completed ? 'Completada':'Pendiente'}</p>

//             `;
//             taskCards.appendChild(card);
//         });
//     };
//     return{
//         update
//     };
// })();
// export default cards;








import tabla from './tabla.js';

const cards = (() => {
    const taskCards = document.getElementById('taskCards');
    const update = () => {
        const tasks =tabla.getTasks();
    taskCards.innerHTML = ''; //limpio el contenido de taskCards

    //crear cards por tarea
    tasks.forEach(task => {
        const card = document.createElement('div');
        card.className = 'taskCard';
        card.innerHTML = `
        <p><strong>Nombre:</strong> ${task.task}</p>
        <p><strong>Descripcion:</strong> ${task.description}</p>
        <p><strong>Fecha:</strong> ${task.date}</p>
        <p><strong>Prioridad:</strong> ${task.priority}</p>
        <p><strong>Estado:</strong> ${task.completed ? 'Completada' : 'Pendiente'}</p>`;
        
        taskCards.appendChild(card);
    });
    };

    return {update};

})();

export default cards;