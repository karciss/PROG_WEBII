const list = document.querySelector('[data-list]')
const tacharUltimo = (evento) => {
    evento.preventDefault();
    const items = list.querySelectorAll('li')
    if(items.length === 0) {
        alert('No hay tareas para tachar')
        return
    }
    const lastItem = items[items.length - 1]
    lastItem.classList.add('tachado')
}

export default tacharUltimo;