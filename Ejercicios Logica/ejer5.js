function binario(numero) {
        
    let binario = '';
    while (numero > 0) {
        binario = (numero % 2) + binario;
        numero = Math.floor(numero / 2);
    }
    
    return binario;
    
    // return numero.toString(2);
}

console.log(binario(10));
console.log(binario(15));