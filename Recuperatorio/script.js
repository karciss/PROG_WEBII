import { inputs } from "js/inputs.js";
import { crearTarea } from "js/crear.js";
import { cargarTareaParaEditar } from "js/editar.js";
import { actualizarTarea } from "js/actualizar.js";
import { eliminarTarea } from "js/eliminar.js";

const btnCrear = document.getElementById("btnCreate");
const btnActualizar = document.getElementById("btnUpdate");
const tablaCuerpo = document.querySelector('[data-tbody]');

let idEditando = null;
const setIdEditando = (id) => { idEditando = id; };

const cargarTareas = () => {
  fetch("http://localhost:3001/posts")
    .then(res => {
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      return res.json();
    })
    .then(data => {
      tablaCuerpo.innerHTML = "";
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
        btn.addEventListener("click", () =>
          cargarTareaParaEditar(btn.dataset.id, btnActualizar, setIdEditando)
        );
      });

      document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", () =>
          eliminarTarea(btn.dataset.id, cargarTareas)
        );
      });
    })
    .catch(err => alert(err.message));
};

btnCrear.addEventListener("click", () =>
  crearTarea(btnActualizar, cargarTareas)
);

btnActualizar.addEventListener("click", () =>
  actualizarTarea(idEditando, btnActualizar, cargarTareas, setIdEditando)
);

window.onload = cargarTareas;
