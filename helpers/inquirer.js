
const inquirer = require('inquirer');
require('colors');

const questions = [
    {
        type: 'list',
        name: 'opcion',
        message: `\t${'¿Que desea hacer?'.green}`,
        choices: [
            {
                value: 1,
                name: `\t${ '1.'.blue } Buscar ciudad`
            },
            {
                value: 2,
                name: `\t${ '2.'.blue } Historial de búsqueda`
            },
            {
                value: 0,
                name: `\t${ '0.'.blue } Salir`
            }
        ]
    }
]

const inquirerMenu = async() => {

    console.clear();
    console.log('\t\t================================='.bgBlue);
    console.log('\t\t        Weather App'.bgBlack);
    console.log('\t\t=================================\n\n'.bgBlue);

    const { opcion } = await inquirer.prompt(questions);

    return opcion;
}

const inquirerPausa = async() => {

    const pausar = [
        {
            type: 'input',
            name: 'pausa',
            message: `Presione la tecla ${ 'ENTER'.blue } para continuar.`
        }
    ]

    const { pausa } = await inquirer.prompt(pausar);
    return pausa;
}

const obtenerInput = async( message ) => {

    const question = [
        {
            type: 'input',
            name: 'descripcion',
            message,
            validate( value ) {
                if( value.length === 0 ) {
                    return `${'Por favor, debe ingresar un valor.'.bgRed}`
                }
                return true;
            }
        }
    ];
 
    const { descripcion } = await inquirer.prompt(question);

    return descripcion;
}

const listadoCiudades = async(ciudades = []) => {

    const choices = ciudades.map((ciudad, i) => {

        const index = `${i + 1}`.green;

        return {
            value: ciudad.id,
            name: `${index}. ${ciudad.nombre}`
        }
        
    });

    choices.push(
        {
            value: '0',
            name: '0. '.green + 'Cancelar'
        }
    );

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Ciudad seleccionada: ',
            choices
        }
    ];

    const { id } = await inquirer.prompt(preguntas);

    return id;

}

const listadoHistorial = async(historic = []) => {

    const choices = historic.map((history, i) => {

        const index = `${i + 1}`.green;

        return {
            value: history.id,
            name: `${index}. ${history.nombre}`
        }
        
    });

    choices.push(
        {
            value: '0',
            name: '0. '.green + 'Cancelar'
        }
    );

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Registro seleccionado: ',
            choices
        }
    ];

    const { id } = await inquirer.prompt(preguntas);

    return id;

}

const confirmacion = async(mensaje) => {

    const pregunta = {
        type: 'confirm',
        name: 'validation',
        mensaje
    }

    const { validation } = await inquirer.prompt(pregunta);

    return validation;

}

module.exports = {
    inquirerMenu,
    inquirerPausa,
    obtenerInput,
    listadoCiudades,
    listadoHistorial,
    confirmacion,
}

