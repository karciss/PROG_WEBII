const listarProductos = () => fetch("http://localhost:3000/productos").then((respuesta) => respuesta.json());

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
     };