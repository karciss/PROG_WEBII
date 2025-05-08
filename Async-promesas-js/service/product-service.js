/*const listarProductos = () => fetch("http://localhost:3000/productos").then((respuesta) => respuesta.json());

     const crearProducto = (nombre, precio, descripcion) => {
         return fetch("http://localhost:3000/productos", {
             method: "POST",
             headers: {
                 "Content-Type": "application/json"
             },
             body: JSON.stringify({ nombre, precio, descripcion, id: uuid.v4() })
         });
     };

     const eliminarProducto = (id) => {
         return fetch(`http://localhost:3000/productos/${id}`, {
             method: "DELETE"
         });
     };

     const obtenerProducto = (id) => {
         return fetch(`http://localhost:3000/productos/${id}`).then((respuesta) => respuesta.json());
     };

     const actualizarProducto = (nombre, precio, descripcion, id) => {
         return fetch(`http://localhost:3000/productos/${id}`, {
             method: "PUT",
             headers: {
                 "Content-Type": "application/json"
             },
             body: JSON.stringify({ nombre, precio, descripcion })
         }).then((respuesta) => respuesta).catch((err) => console.log(err));
     };

     export const productService = {
         listarProductos,
         crearProducto,
         eliminarProducto,
         obtenerProducto,
         actualizarProducto
     };*/



     function generarId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
    
    const API_BASE_URL = 'http://localhost/api1/productos.php';
    
    const lista_productos = () => {
        return fetch(API_BASE_URL)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error en la respuesta de la API: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Datos recibidos de la API:", data); // Verificar los datos
                return data;
            })
            .catch((error) => {
                console.error('Error al obtener los productos:', error);
                throw error;
            });
    };
    
    const crearProducto = (nombre, precio, descripcion) => {
        return fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, precio, descripcion, id: generarId() })
        }).then(response => {
            if (!response.ok) {
                throw new Error(`Error al crear el producto: ${response.status} ${response.statusText}`);
            }
            return response.json();
        }).catch(error => {
            console.error('Error al crear el producto:', error);
            throw error;
        });
    };
    
    const eliminarProducto = (id) => {
        return fetch(`${API_BASE_URL}?id=${id}`, {
            method: 'DELETE'
        }).then(response => {
            if (!response.ok) {
                throw new Error(`Error al eliminar el producto: ${response.status} ${response.statusText}`);
            }
            return response.json();
        }).catch(error => {
            console.error('Error al eliminar el producto:', error);
            throw error;
        });
    };
    
    const producto = (id) => {
        return fetch(`${API_BASE_URL}?id=${id}`)
            .then((respuesta) => {
                if (!respuesta.ok) {
                    throw new Error(`Error al obtener el producto: ${respuesta.status} ${respuesta.statusText}`);
                }
                return respuesta.json();
            })
            .catch(error => {
                console.error('Error al obtener el producto:', error);
                throw error;
            });
    };
    
    const actualizarProducto = (nombre, precio, descripcion, id) => { 
        return fetch(API_BASE_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, precio, descripcion, id })
        }).then(respuesta => {
            if (!respuesta.ok) {
                throw new Error(`Error al actualizar el producto: ${respuesta.status} ${respuesta.statusText}`);
            }
            return respuesta.json();
        }).catch(err => {
            console.error('Error al actualizar el producto:', err);
            throw err;
        });
    };
    
    export const productService = {
        lista_productos,
        crearProducto,
        eliminarProducto,
        producto,
        actualizarProducto
    };