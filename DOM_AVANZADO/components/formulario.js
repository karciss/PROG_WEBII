// const Form = (()=>{

// //recuperando datos del formulario
// const form = document.querySelector(['data-form']);

// const inputTask = document.querySelector(['data-input-task']);
// const inputDescription = document.querySelector(['data-input-descripcion']);
// const inputDate = document.querySelector(['data-input-fecha']);
// const inputPrioridad = document.querySelector(['data-input-prioridad']);

// //guardo los datos como objeto
// const datosFrom=()=>{
//     return{
//         task: inputTask.value.trim(),
//         description: inputDescription.value.trim(),
//         date: inputDate.value.trim(),
//         prioridad: inputPrioridad.value.trim()
//     };
// };

// //resetar formulario
// const reset=()=>{
//     inputTask.value='';
//     inputDescription.value='';
//     inputDate.value='';
//     inputPrioridad.value='';
// };

// //devuleve los datos para usarlos en la tabla
// const setDatos=(callback)=>{
//     form.addEventListener('submit',(event)=>{
//         event.preventDefault();
//         callback(datosFrom());
//         reset();
//     });
// };

// return{
//     setDatos
// };

// })();

// export default Form;








const Form = (() => {

    //recuperando data de formulario
const form = document.querySelector('[data-form]'); //recupero el formulario
const inputTask = document.querySelector('[data-input-task]');
const inputDescription = document.querySelector('[data-input-descripcion]');  
const date = document.querySelector('[data-input-fecha]'); // Corregido: Quitar corchetes alrededor del selector
const inputPrioridad = document.querySelector('[data-input-prioridad]'); // Corregido: Quitar corchetes alrededor del selector

//guardo los datos como objeto
const datosForm=()=>{ 
    return{ //devuelvo un objeto
        task: inputTask.value.trim(), //trim elimina los espacios en blanco al principio y al final de un string
        description: inputDescription.value.trim(),
        date: date.value.trim(), 
        priority: inputPrioridad.value.trim(), 
    };
};
// borro los datos del formulario
const reset =()=>{ 
    inputTask.value=''; //value es el valor del input
    inputDescription.value=''; 
    date.value=''; 
    inputPrioridad.value=''; 
};
// devuelvo los datos del formulario
const setDatos =(callback)=>{ //callback es una funcion que se ejecuta dentro de otra funcion
    form.addEventListener('submit',(evento)=>{ //evento es un objeto que contiene informacion sobre el evento que se esta produciendo
        evento.preventDefault(); //previene la accion por defecto del evento
        callback(datosForm()); //ejecuto la funcion callback y le paso los datos del formulario
        reset();
    });
};

return {setDatos}; //devuelvo la funcion setDatos

}) ();

export default Form; //exporto la funcion Form