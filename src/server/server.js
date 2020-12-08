import express from 'express';
import dotenv from 'dotenv';

dotenv.config();//busca en el proyecto un archivo .env y toma sus variables

//definimos 2 contantes que seran el entorno y el puerto de .env
const { ENV, PORT } =  process.env;

const app = express();

if(ENV === 'development'){
    console.log("Development config");
}

app.get('*', (request, response) => {//llamado al servidor, capturamos todas las rutas
    console.log("Hola mundo")
    response.send({ hello: 'express' })//retorna un json
});

app.listen(PORT, (err) => {//funcion anonima que recobe error
    if(err) console.err(err);
    else console.log("Server running on port 3000")
});