const API_URL = "http://localhost:3001/posts";

const eliminarTarea = (id, cargarTareas) => {
  fetch(`${API_URL}/${id}`, { method: "DELETE" })
    .then(() => cargarTareas())
    .catch(err => alert(err.message));
};

export { eliminarTarea };
