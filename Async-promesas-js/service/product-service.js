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



    //  CONEXION XAMPP

    /* function generarId() {
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
    };*/


    // CONEXION SUPABASE

function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

const SUPABASE_URL = 'https://qixdcadprrreesrtoaky.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpeGRjYWRwcnJyZWVzcnRvYWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NzY5MDIsImV4cCI6MjA2MjQ1MjkwMn0.5MUi_Oi-VwvrtrwVqzFbzUmjJEi2D8mvIZNxZmkKfa4';
const TABLE = 'productos';
const API_URL = `${SUPABASE_URL}/rest/v1/${TABLE}`;
const HEADERS = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

const lista_productos = () => {
    return fetch(`${API_URL}?select=*`,
        { headers: HEADERS })
        .then(res => {
            if (!res.ok) throw new Error('error en listar productos');
            return res.json();
        });
};

const crearProducto = (nombre, precio, descripcion) => {
    const producto = {
        nombre,
        descripcion,
        precio: parseFloat(precio),
        id: generarId()
    };
    return fetch(API_URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(producto)
    }).then(async (res) => {
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || 'Error al crear el producto');
        }
        const text = await res.text();
        return text ? JSON.parse(text) : producto;
    }).catch(err => {
        console.error(err || 'Error al crear el producto');
        throw err;
    });
};

const eliminarProducto = (id) => {
    return fetch(`${API_URL}?id=eq.${id}`, {
        method: 'DELETE',
        headers: HEADERS
    }).then(res => {
        if (!res.ok) throw new Error('Error al eliminar producto');
        return res;
    }).catch((error) => {
        console.error('Error al eliminar producto', error);
        throw error;
    });
};

const producto = (id) => {
    return fetch(`${API_URL}?id=eq.${id}`,
        { headers: HEADERS })
        .then(res => {
            if (!res.ok) throw new Error('Error al obtener producto');
            return res.json();
        })
        .then(data => Array.isArray(data) && data.length > 0 ? data[0] : null);
};

const actualizarProducto = (nombre, precio, descripcion, id) => {
    return fetch(`${API_URL}?id=eq.${id}` , {
        method: 'PATCH',
        headers: HEADERS,
        body: JSON.stringify({ nombre, descripcion, precio: parseFloat(precio) })
    }).then(async (res) => {
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || 'Error al actualizar el producto');
        }
        const data = await res.json();
        if (!data || data.length === 0) {
            throw new Error('No se encontró el producto para actualizar');
        }
        return data[0];
    }).catch(err => {
        console.error(err || 'Error al actualizar el producto');
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