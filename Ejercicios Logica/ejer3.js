function invertir(numero){
    let num = numero.toString();
    let numInv = "";
    for(let i = num.length-1; i >= 0; i--){
        numInv += num[i];
    }
    return parseInt(numInv);
}

console.log(invertir(123456789));
console.log(invertir(987654321));