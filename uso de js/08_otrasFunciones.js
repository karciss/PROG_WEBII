const ciudadesDisponibles  = new Array ("Santiago", "Bogota", "Lima", "MonteVideo");
const paisesDisponibles = ["colombia", "chile","peru","panama"];
const cantidadCiudades = ciudadesDisponibles.length;

console.log(`En la lista existen ${cantidadCiudades} elementos`);
console.log(`En la lista existen ${paisesDisponibles.length} elementos`)

//quitar el primer elemento de un array 
ciudadesDisponibles.shift();
console.log(`En la lista existen ${cantidadCiudades.length} elementos`);
console.log(ciudadesDisponibles);


//quitar el ultimo elemento de un array
ciudadesDisponibles.pop();
console.log(`En la lista existen ${cantidadCiudades.length} elementos`);
console.log(ciudadesDisponibles);

//ordenar 
console.log(ciudadesDisponibles.sort());

//posicion de un elemento
console.log(`En la lista existen ${paisesDisponibles.indexOf("peru")}`);

//concatenar dos listas
const listaPaisesCiudades = paisesDisponibles.concat(ciudadesDisponibles);
console.log(listaPaisesCiudades);
