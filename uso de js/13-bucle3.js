const datos = [
    {'materia':'Programacion Web I',
        'calificacion':70

    },
    {'materia':'Base de Datos II',
        'calificacion':10
    },
    {'materia':'Programacion Web II',
        'calificacion':89
    },
    {'materia':'IOT Robotica',
        'calificacion':95
    },
    {'materia':'Programacion Movil II',
        'calificacion':94
    },
    {
        'materia':'Animacion Digital',
        'calificacion':39
    },
    {
        'materia':'Programacion III',
        'calificacion':67
    }
    ,{
        'materia':'Programacion II',
        'calificacion':91
    },
    {
        'materia':'Base de Datos I',
        'calificacion': 78
    },
    {
        'materia':'Programacion Movil I',
        'calificacion': 41
    }

];

let materiaSeleccionada = '';
const notaAprobacion = 51;

for (let i = 0; i < datos.length && notaAprobacion== ''; i++){
    if (datos[i].calificacion >= notaAprobacion){
        materiaSeleccionada = datos[i].materia;
        break;
    }
} 

if(materiaSeleccionada==''){
    console.log(`no aprobaste la materias `)
}
else{
    console.log(`la materia aprobada es : ${materiaSeleccionada}`)
}