import { obtenerDatos, limpiar } from "js/inputs.js";

const API_URL = "http://localhost:3001/posts";


const crearTarea = (btnActualizar, cargarTareas) => {
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
      limpiar(btnActualizar);
      cargarTareas();
    })
    .catch(err => alert(err.message));
};

export { crearTarea };
