
const fs = require('fs');

const { default: axios } = require('axios');
const { inquirerPausa } = require('../helpers/inquirer');


class Busqueda {

    history = [];
    db_route = './database/history.json'
    
    constructor() {
        
        // Listar historial desde BD si existe.
        this.leerBaseDatos();
    }
    
    async busquedaCiudad(ciudad = '') {

        // const token = 'pk.eyJ1Ijoib2Nob2FndXN0YXZvMjQiLCJhIjoiY2t0dnVzd3k2MmRzeTJ2cnI2dmRuNGQzZyJ9.oeNrfmY07CRnr74-4oexbw';

        try {

            // TODO: forma sencilla de petición GET con axios.

            // const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${ciudad}.json?access_token=${token}&limit=5&language=es`;

            // await axios.get(url)
            //             .then(resp => {
            //                 console.info(resp.data);
            //             })
            //             .catch(err => {
            //                 console.error(err);
            //             })

            // TODO: petición GET creando instancia con axios.

            const GetMapboxInstance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ciudad}.json`,
                params: {
                    //TODO: usando variables de entorno.
                    'access_token': process.env.MAPBOX_KEY,
                    'limit': 5,
                    'language': 'es'
                },
                timeout: 10000,
                responseType: 'json',
                responseEncoding: 'utf8'
            });

            const ciudades = await GetMapboxInstance.get();

            if (ciudades) {
                return ciudades.data.features.map(ciudad => ({
                    id: ciudad.id,
                    nombre: ciudad.place_name,
                    y: ciudad.center[0],
                    x: ciudad.center[1]
                }));
            } else {
                return [];
            }

        } catch (error) {
            console.error(`Ocurrió un error al buscar las ciudades.`.red);
            throw error;
        }

    }

    async temperaturaCiudad(_lat, _lon) {

        try {

            // TODO: petición GET creando instancia con axios.

            /**
             * Para las unidades de temperatura, es necesario usar el parametro units, con los
             * siguientes valores:
             *  * Fahrenheit - imperial
             *  * Celcius - metric
             *  * Kelvin is default
             */

            const GetOpenWeatherInstance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    //TODO: usando variables de entorno.
                    'lat': _lat,
                    'lon': _lon,
                    'appid': process.env.OPEN_WEATHER_KEY,
                    'units': 'metric',
                    'lang': 'es'
                },
                timeout: 10000,
                responseType: 'json',
                responseEncoding: 'utf8'
            });

            const tempData = await GetOpenWeatherInstance.get();

            console.log(tempData.data);

            if (tempData.data) {
                return tempData.data;
            } else {
                return null;
            }

        } catch (error) {
            console.error(`Ocurrió un error al realizar la búsqueda.`.red);
            throw error;
        }
    }

    async guardarHistorial(datos) {

        // Añadir nuevo registro al historial
        this.history.unshift(datos);

        // Guardar historial en base de datos
        this.guardarBaseDatos();

    }

    guardarBaseDatos() {
        const payload = {
            history: this.history
        }

        fs.writeFileSync(this.db_route, JSON.stringify(payload));
    }

    leerBaseDatos() {

        if (fs.existsSync(this.db_route)) {

            const dbData = fs.readFileSync(this.db_route, { encoding: 'utf-8' });

            if (dbData) {
                const datos = JSON.parse(dbData);
                this.history = datos.history;
            }
    
        }
    }
}

module.exports = Busqueda;