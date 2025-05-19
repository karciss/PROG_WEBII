// SIN BUSQUEDA
/*import { productService } from "../service/product-service.js";

const crear_nueva_fila = (nombre, precio, descripcion, id) => {
    const fila = document.createElement('tr');
    const contenido = `
        <td class="td" data-td>${nombre}</td>
        <td>${typeof precio === 'number' ? precio.toFixed(2) : precio}</td>
        <td>${descripcion}</td>
        <td>
            <ul class="table__button-control">
                <li>
                    <a href="../screens/editar_producto.html?id=${id}" class="simple-button simple-button--edit">Editar</a>
                </li>
                <li>
                    <button class="simple-button simple-button--delete" type="button" id="${id}">Eliminar</button>
                </li>
            </ul>
        </td>
    `;
    fila.innerHTML = contenido;
    const btn = fila.querySelector("button");
    btn.addEventListener("click", () => {
        productService.eliminarProducto(id)
            .then(() => {
                alert("Producto eliminado");
                fila.remove();
            })
            .catch(error => alert("Error al eliminar el producto"));
    });
    return fila;
};

const table = document.querySelector("[data-table]");

productService.lista_productos()
    .then(data => {
        console.log("Productos recibidos:", data); // Verificar los datos recibidos
        data.forEach(({ nombre, precio, descripcion, id }) => {
            const nuevaFila = crear_nueva_fila(nombre, precio, descripcion, id);
            table.appendChild(nuevaFila);
        });
    })
    .catch(error => {
        console.error("Error al cargar los productos:", error);
    });*/



import { productService } from "../service/product-service.js";

const table = document.querySelector("[data-table]");
const searchInput = document.querySelector("[searchInput]");


const crear_nueva_fila = (nombre, precio, descripcion, id) => {
    const fila = document.createElement('tr');
    const contenido = `
        <td class="td" data-td>${nombre}</td>
        <td>${typeof precio === 'number' ? precio.toFixed(2) : precio}</td>
        <td>${descripcion}</td>
        <td>
            <ul class="table__button-control">
                <li>
                    <a href="../screens/editar_producto.html?id=${id}" class="simple-button simple-button--edit">Editar</a>
                </li>
                <li>
                    <button class="simple-button simple-button--delete" type="button" id="${id}">Eliminar</button>
                </li>
            </ul>
        </td>
    `;
    fila.innerHTML = contenido;
    const btn = fila.querySelector("button");
    btn.addEventListener("click", () => {
        productService.eliminarProducto(id)
            .then(() => {
                alert("Producto eliminado");
                fila.remove();
            })
            .catch(error => alert("Error al eliminar el producto"));
    });
    return fila;
};

const actualizarTabla = (productos) => {
    //limpiar
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    productos.forEach(({ nombre, precio, descripcion, id }) => {
        const nuevaFila = crear_nueva_fila(nombre, precio, descripcion, id);
        table.appendChild(nuevaFila);
    });
};

productService.lista_productos()
    .then(data => {
        actualizarTabla(data);

        searchInput.addEventListener("input", () => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm === ""){
                productService.lista_productos().then(data => actualizarTabla(data));
            } else{
                productService.buscarProductos(searchTerm)
                .then(productos =>{
                    actualizarTabla(productos);
                })
                .catch(error => {
                    console.error("Error al buscar productos:", error);
                });
            }

        });
    })
    .catch(error => {
        console.error("Error al cargar los productos:", error);
    });