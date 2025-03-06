const numeros = [1,2,3,4,5,6,7,8,9];

function primos(num){
    if (num<2){
        return false;
    }
    for (let j = 2; j<Math.sqrt(num); j++){
        if (num%j==0){
            return false;
        }
    }
    return true;
}

function mostrar(array){
    var primosNum = [];
    for (let i = 0; i < array.length; i++){
        if (primos(array[i])===true)
        {
            primosNum.push(array[i]);
        }
    }
    return primosNum;
}
console.log(mostrar(numeros));

