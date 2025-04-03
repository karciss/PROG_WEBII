const list = document.querySelector('[data-list]')

const contarItems = (evento) => {
    evento.preventDefault();
    const items = list.querySelectorAll('li')
    const count = items.length
    const output = document.querySelector('[data-output]')
    output.innerText = `Total de tareas: ${count}`
}
export default contarItems;