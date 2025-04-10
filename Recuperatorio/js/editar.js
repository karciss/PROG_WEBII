import { inputs } from "js/inputs.js";

const API_URL = "http://localhost:3001/posts";

const cargarTareaParaEditar = (id, btnActualizar, setIdEditando) => {
  fetch(`${API_URL}/${id}`)
    .then(res => res.json())
    .then(post => {
      inputs.nombre.value = post.nombre;
      inputs.fecha.value = post.fecha;
      inputs.descripcion.value = post.descripcion;
      inputs.nombreAsignado.value = post.nombreAsignado;
      inputs.valorNumerico.value = post.valorNumerico;
      setIdEditando(id);
      btnActualizar.disabled = false;
    });
};

export { cargarTareaParaEditar };
