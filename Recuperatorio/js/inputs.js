const inputs = {
  nombre: document.querySelector('[data-input-task]'),
  fecha: document.querySelector('[data-input-fecha]'),
  descripcion: document.querySelector('[data-input-descripcion]'),
  nombreAsignado: document.querySelector('[data-input-nombre]'),
  valorNumerico: document.querySelector('[data-input-numerico]'),
};

const obtenerDatos = () => ({
  nombre: inputs.nombre.value,
  descripcion: inputs.descripcion.value,
  fecha: inputs.fecha.value,
  nombreAsignado: inputs.nombreAsignado.value,
  valorNumerico: inputs.valorNumerico.value
});

const limpiar = (btnActualizar) => {
  inputs.nombre.value = '';
  inputs.descripcion.value = '';
  inputs.fecha.value = '';
  inputs.nombreAsignado.value = '';
  inputs.valorNumerico.value = '';
  btnActualizar.disabled = true;
};

export { inputs, obtenerDatos, limpiar };
