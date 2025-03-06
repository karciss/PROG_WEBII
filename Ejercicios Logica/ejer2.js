function palabra(frase){
    let palabras = frase.split(" ");
    let masLarga= "";
    for(let i = 0; i < palabras.length; i++){
        if(palabras[i].length > masLarga.length){
            masLarga = palabras[i];
        }
    }
    return masLarga;
}

console.log(palabra("practica ejercicios logica programacion web II")); 