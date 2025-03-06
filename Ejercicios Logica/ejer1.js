const numeros = [1,2,3,4,5];

function contarPares(array) {
    let pares = 0;
    let impares = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i] % 2 == 0) {
            pares++;
        } else {
            impares++;
        }
    }
    return { pares, impares };
}
console.log(contarPares(numeros)); 