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

const procesarDatos = datos => {
    return datos
    .filter(datos => datos.calificacion >= 51)
    .map(datos => {
        const { materia }  = datos;
        return materia.length >5 ? materia.toUpperCase() : materia.toLowerCase();
    });
}
const resultado = procesarDatos(datos);
console.log(resultado);

