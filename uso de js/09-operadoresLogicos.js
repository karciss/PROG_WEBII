let edadPersona = 17;
let conAcompanante = true;
const precioPasaje = 1000;
const ciudadDestino = "Sucre";
const ciudadesDisponibles  = new Array ("Santiago", "Bogota", "Lima", "MonteVideo");


if(precioPAsaje ===1000){
    console.log(`el pasaje cuesta 1000`)
}

console.log(`Verifica pasaje para ${ciudadDestino}`);

if ((ciudadesDisponibles.indexOf(ciudadDestino)>-1)&&
    (edadPersona>=18) || conAcompanante){
        console.log(`pasaje disponible`)
    }
    else{
        console.log(`pasaje no disponible`);
    }