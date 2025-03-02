const ciudadDestino = "Sucre";
const ciudadesDisponibles  = new Array ("Santiago", "Bogota", "Lima", "MonteVideo");

let edad = 17;
let compania = false;

if (edad >=18 || compania){
    if(ciudadDestino.indexOf(ciudadDestino)> -1){
        console.log(`pasaje disponible`)
    }
    else{
        console.log(`ciudad no disponible`);
    }
}else{
    if(edad >=16 && ciudadDestino=="Sucre"){
        console.log('pasaje disponible')
    }
    else{
        console.log(`pasajero no cumple las reglas`)
    }
}
    

