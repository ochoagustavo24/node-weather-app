
require('dotenv').config();

const { obtenerInput, inquirerMenu, inquirerPausa, listadoCiudades, listadoHistorial } = require("./helpers/inquirer");

const Busqueda = require("./models/busqueda");

const main = async() => {

    const busquedas = new Busqueda();
    let opcion;

    do {
        
        opcion = await inquirerMenu();

        switch (opcion) {
            case 1:

                let exit = 0;

                do {

                    // Capturar nombre de la ciudad para la búsqueda
                    const city = await obtenerInput('Ciudad: ');

                    // Buscar las ciudades que coincidan con la ciudad brindada.
                    const ciudades = await busquedas.busquedaCiudad(city);

                    if (ciudades.length > 0) {
                     
                        // Obtener ID de la ciudad seleccionada de las opciones.
                        const idCity = await listadoCiudades(ciudades);

                        if (idCity === '0'){
                            exit = 1;
                            continue;
                        }

                        // Obtener los datos de la ciudad seleccionada
                        const citySel = ciudades.find( c => c.id === idCity );

                        // Obtener el clima de la ciudad a partir de latitud y longitud.
                        const tempData = await busquedas.temperaturaCiudad(citySel.x, citySel.y);

                        if (tempData !== null) {

                            // Crear objeto para almacenar en el historial.
                            const record = {
                                //FIXME: Cambiar por funcion para hora local.
                                fecha: new Date().toISOString(),
                                id: idCity,
                                nombre: citySel.nombre,
                                latitud: citySel.x,
                                longitud: citySel.y,
                                descripcion: tempData.weather[0].description,
                                temperatura: tempData.main.temp,
                                sensacion_termica: tempData.main.feels_like,
                                maxima: tempData.main.temp_max,
                                minima: tempData.main.temp_min,
                                presion: tempData.main.pressure,
                                humedad: tempData.main.humidity,
                                nubes: tempData.clouds.all,
                                velocidad: tempData.wind.speed,
                                direccion: tempData.wind.deg,
                                gust: tempData.wind.gust    
                            }

                            // TODO: Guardar registro en el historial.
                            await busquedas.guardarHistorial(record);

                            // FIXME: Elegir tipo de temperatura a mostrar (Celcius por defecto).
                            
                            // Mostrar los resultados en pantalla.
                            // Se transforma la temperatura de Kelvin a Celcius
                            console.clear();
                            console.log(`\n\tInformación de ${ citySel.nombre }`.green);

                            console.log('\nCoordenadas: '.blue.bold);
                            console.log('Latitud: ' + `${ citySel.x }`.green.bold);
                            console.log('Longitud: ' + `${ citySel.y }`.green.bold);

                            console.log('\nClima: '.blue.bold);
                            console.log('Descripcion: '+ `${ tempData.weather[0].description }`.green.bold);
                            console.log('Temperatura: '+ `${ tempData.main.temp } °C`.green.bold);
                            console.log('Sensación térmica: '+ `${ tempData.main.feels_like } °C`.green.bold);
                            console.log('Máxima: '+ `${ tempData.main.temp_max } °C`.green.bold);
                            console.log('Mínima: '+ `${ tempData.main.temp_min } °C`.green.bold);
                            console.log('Presión: '+ `${ tempData.main.pressure } hPa`.green.bold);
                            console.log('Humedad: '+ `${ tempData.main.humidity }%`.green.bold);
                            
                            console.log('\nViento: '.blue.bold);
                            console.log('Nubes: '+ `${ tempData.clouds.all } %`.green.bold);
                            if(tempData.wind.speed) console.log('Velocidad: '+ `${ tempData.wind.speed } m/s`.green.bold);
                            if(tempData.wind.deg) console.log('Dirección: '+ `${ tempData.wind.deg }`.green.bold);
                            if(tempData.wind.gust) console.log('Gust: '+ `${ tempData.wind.gust } m/s`.green.bold);
                            
                        } else {
                            console.info(`No se encontraron datos en la búsqueda. Intente nuevamente.`.blue);
                        }
                        
                        exit = 1;
                        
                    } else {
                        console.info(`No se encontraron ciudades que coincidan con el criterio de búsqueda. Intente nuevamente.`.blue);
                    }
                    
                } while (exit === 0);

                break;
            
            case 2:

                if (busquedas.history.length > 0) {

                    // Obtener ID de la ciudad seleccionada de las opciones.
                    const idCity = await listadoHistorial(busquedas.history);

                    // Obtener los datos de la ciudad seleccionada
                    const record = busquedas.history.find( r => r.id === idCity );

                    console.clear();
                    console.log(`\n\tInformación de ${ record.nombre }`.green);

                    console.log('\nFecha: '.grey.bold + `${ record.fecha }`.cyan);

                    console.log('\nCoordenadas: '.blue.bold);
                    console.log('Latitud: ' + `${ record.latitud }`.green.bold);
                    console.log('Longitud: ' + `${ record.longitud }`.green.bold);

                    console.log('\nClima: '.blue.bold);
                    console.log('Descripcion: '+ `${ record.descripcion }`.green.bold);
                    console.log('Temperatura: '+ `${ record.temperatura } °C`.green.bold);
                    console.log('Sensación térmica: '+ `${ record.sensacion_termica } °C`.green.bold);
                    console.log('Máxima: '+ `${ record.maxima } °C`.green.bold);
                    console.log('Mínima: '+ `${ record.minima } °C`.green.bold);
                    console.log('Presión: '+ `${ record.presion } hPa`.green.bold);
                    console.log('Humedad: '+ `${ record.humedad }%`.green.bold);
                    
                    console.log('\nViento: '.blue.bold);
                    console.log('Nubes: '+ `${ record.nubes } %`.green.bold);
                    if(record.velocidad) console.log('Velocidad: '+ `${ record.velocidad } m/s`.green.bold);
                    if(record.direccion) console.log('Dirección: '+ `${ record.direccion }`.green.bold);
                    if(record.gust) console.log('Gust: '+ `${ record.gust } m/s`.green.bold);
                } else {
                    console.warn('No hay registros de búsquedas realizadas.');
                }

                break;
        
            default:
                break;
        }

        if(opcion !== 0) await inquirerPausa();

    } while (opcion !== 0);

}

main();