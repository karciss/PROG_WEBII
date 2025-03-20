// import cards from "./cards.js";

// const tabla= (()=>{
//     //cuando recuperamos mediante id es getelementbyid pero cuando es por clase es queryselector
//     const cuerpoTable = document.getElementById('taskTable').getElementsByTagName('tbody')[0];

//     //agrego filas y armando el cuerpo de la tabla
//     const addTask=(task)=>{
//         const nuevaFila = cuerpoTable.insertRow(); //creo nueva fila

//         //asigno datos a las celdas
//         nuevaFila.innerCell(0)=textContent=task.task;
//         nuevaFila.innerCell(1)=textContent=task.description;
//         nuevaFila.innerCell(2)=textContent=task.date;
//         nuevaFila.innerCell(3)=textContent=task.prioridad;
        
//         //acciones
//         const accionCell = nuevaFila.insertCell(4);
//         const accions = document.createElement('div');
//         accions.className = 'actions'

//         //creo boton
//         const completeButton = document.createElement('button')
//         completeButton.textContent = 'Completar';
//         completeButton.className = 'view';
//         completeButton.addEventListener('click',()=>{
//             nuevaFila.classList.toggle('completed');
//             cards.update();


//         });

//         accions.appendChild(completeButton);

//         const deleteButton = document.createElement('button');
//         deleteButton.textContent = 'Eliminar';
//         deleteButton.className = 'delete';
//         deleteButton.addEventListener('click',()=>{
//             cuerpoTable.deleteRow(nuevaFila.rowIndex);
            
//             //sobrecarga de funcion porque estan conectadas (cruce de informacion)
//             cards.update();



//         });
//         accions.appendChild(deleteButton);
//         accionCell.appendChild(accions);
//     };

//     //recupero yo giam elementos (texto) de la tabla
//     const getTask=()=>{
//         return Array.from(cuerpoTable.rows).map(row => ({
//             task: row.cells[0].textContent,
//             description: row.cells[1].textContent,
//             date: row.cells[2].textContent,
//             prioridad: row.cells[3].textContent,
//             completed: row.classList.contains('completed')
//         }));
//     };

//     return{
//         addTask,
//         getTask
//     };


// })();
// export default tabla;








import cards from "./cards.js";
const tabla = (() => {
    const cuerpoTabla = document.getElementById('taskTable').getElementsByTagName('tbody')[0]; //recupero el cuerpo de la tabla
    //recupero el cuerpo de la tabla    

    const addTask = (task) => {
        const nuevaFila = cuerpoTabla.insertRow(); //inserto una fila en la tabla
        nuevaFila.insertCell(0).textContent = task.task; //inserto una celda en la fila
        nuevaFila.insertCell(1).textContent = task.description; 
        nuevaFila.insertCell(2).textContent = task.date;
        nuevaFila.insertCell(3).textContent = task.priority;

        const accionCell = nuevaFila.insertCell(4); 
        const accions = document.createElement('div'); //creo un div
        accions.className= 'actions'; //le asigno una clase

        //crear boton
        const completeButton = document.createElement('button'); 
        completeButton.textContent = 'completar';
        completeButton.className = 'view';
        completeButton.addEventListener('click',()=>{
            nuevaFila.classList.toggle('completed');

            cards.update();
        });

        accions.appendChild(completeButton); //agrego el boton al div

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'eliminar';
        deleteButton.className = 'delete';
        deleteButton.addEventListener('click',()=>{
            cuerpoTabla.deleteRow(nuevaFila.rowIndex-1);

            cards.update();

        });

        accions.appendChild(deleteButton); //agrego el boton al div
        accionCell.appendChild(accions); //agrego el div a la celda

    };
//recupero los datos de la tabla
const getTasks = () => {
    return Array.from(cuerpoTabla.rows).map(row=>( {
        task: row.cells[0].textContent,
        description: row.cells[1].textContent,
        date: row.cells[2].textContent,
        priority: row.cells[3].textContent,
        completed: row.classList.contains('completed')

        
    }));
};

return {addTask, getTasks};

})();

export default tabla; //exporto la funcion tabla