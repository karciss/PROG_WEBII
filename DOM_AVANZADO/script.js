import Form from './components/formulario.js';
import tabla from './components/tabla.js';
import cards from './components/cards.js';

(()=>{
        Form.setDatos((task)=>{
        tabla.addTask(task);
        cards.update();
    });
})();