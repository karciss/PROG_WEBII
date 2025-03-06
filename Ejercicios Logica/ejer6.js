const numeros = [1,1,1,2,2,3,3,3,3];

function numRepetido(array){
    let contador = {};
    let maxNum = array[0];
    let masRep = 0;
    
    for (i=0; i<array.lenght; i++){
    let num = array[i];
    if (contador[num]){
        contador[num]++;
    } else {
        contador[num] = 1;
    }
    if (contador[num] > masRep){
        maxNum = num;
        masRep = contador[num];
    }
    
    }
    return maxNum;
}
console.log(numRepetido(numeros));