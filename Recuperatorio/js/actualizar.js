import { obtenerDatos, limpiar } from "js/inputs.js";

const API_URL = "http://localhost:3001/posts";


const actualizarTarea = (idEditando, btnActualizar, cargarTareas, setIdEditando) => {
  if (!idEditando) return;

  fetch(`${API_URL}/${idEditando}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obtenerDatos())
  })
    .then(() => {
      limpiar(btnActualizar);
      cargarTareas();
      setIdEditando(null);
    })
    .catch(err => alert(err.message));
};

export { actualizarTarea };
