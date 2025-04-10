
// no modular

const API_URL = "http://localhost:3001/posts";

const inputs = {
  nombre: document.querySelector('[data-input-task]'),
  fecha: document.querySelector('[data-input-fecha]'),
  descripcion: document.querySelector('[data-input-descripcion]'),
  nombreAsignado: document.querySelector('[data-input-nombre]'),
  valorNumerico: document.querySelector('[data-input-numerico]'),
};

const btnActualizar = document.querySelector('[data-btnUpdate]');
let idActual = null;


const obtenerDatos = () => ({
  nombre: inputs.nombre.value,
  descripcion: inputs.descripcion.value,
  fecha: inputs.fecha.value,
  nombreAsignado: inputs.nombreAsignado.value,
  valorNumerico: inputs.valorNumerico.value
});


const limpiar = () => {
  inputs.nombre.value = '';
  inputs.descripcion.value = '';
  inputs.fecha.value = '';
  inputs.nombreAsignado.value = '';
  inputs.valorNumerico.value = '';
  idActual = null;
  btnActualizar.disabled = true;
};

const tablaCuerpo = document.querySelector('[data-tbody]');

// cargar y mostrar las tareas en la tabla GET
const cargarTareas = () => {
  fetch(API_URL)
    .then(res => {
      if (!res.ok) throw new Error(`Error en la petición: ${res.status}`);
      return res.json();
    })
    .then(data => {
      //crea fila para cada post
      tablaCuerpo.innerHTML = '';
      data.forEach(post => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${post.id}</td>
          <td>${post.nombre}</td>
          <td>${post.descripcion}</td>
          <td>${post.fecha}</td>
          <td>${post.nombreAsignado}</td>
          <td>${post.valorNumerico}</td>
          <td>
            <button data-id="${post.id}" class="btn-edit">Editar</button>
            <button data-id="${post.id}" class="btn-delete">Eliminar</button>
          </td>
        `;
        tablaCuerpo.appendChild(fila);
      });

      document.querySelectorAll(".btn-edit").forEach(btn => {
        btn.addEventListener("click", () => cargarTareaParaEditar(btn.dataset.id));
      });

      document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", () => eliminarTarea(btn.dataset.id));
      });
    })
    .catch(err => alert(err.message));
};

const cargarTareaParaEditar = id => {
  fetch(`${API_URL}/${id}`)
    .then(res => res.json())
    .then(post => {
      inputs.nombre.value = post.nombre;
      inputs.fecha.value = post.fecha;
      inputs.descripcion.value = post.descripcion;
      inputs.nombreAsignado.value = post.nombreAsignado;
      inputs.valorNumerico.value = post.valorNumerico;
      idActual = id;
      btnActualizar.disabled = false;
    });
};

// actualizar tarea PUT
const actualizarTarea = () => {
  if (!idActual) return;
  fetch(`${API_URL}/${idActual}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obtenerDatos())
  })
    .then(() => {
      limpiar();
      cargarTareas();
    })
    .catch(err => alert(err.message));
};
btnActualizar.addEventListener("click", actualizarTarea);



// eliminar tarea DELETE
const eliminarTarea = id => {
  fetch(`${API_URL}/${id}`, { 
    method: "DELETE" 
  })
    .then(() => cargarTareas())
    .catch(err => alert(err.message));
};



// crear nueva tarea POST
const btnCrear = document.querySelector('[data-btnCreate]');

const crearTarea = () => {
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obtenerDatos())
  })
    .then(res => {
      if (!res.ok) throw new Error(`Error en la creación: ${res.status}`);
      return res.json();
    })
    .then(() => {
      limpiar();
      cargarTareas(); //crea fila para el nuevo post
    })
    .catch(err => alert(err.message));
};
btnCrear.addEventListener("click", crearTarea);




// cargar tareas al iniciar
window.onload = cargarTareas;
