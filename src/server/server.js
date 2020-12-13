import express from 'express';
import dotenv from 'dotenv';
import webpack from 'webpack';

dotenv.config();//busca en el proyecto un archivo .env y toma sus variables

//definimos 2 contantes que seran el entorno y el puerto de .env
const { ENV, PORT } =  process.env;

const app = express();

if (ENV === 'development') {
    console.log('Development config');
    const webpackConfig = require('../../webpack.config');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const compiler = webpack(webpackConfig);//compila la configuracion de webpack
    const { publicPath } = webpackConfig.output;
    const serverConfig = { serverSideRender: true, publicPath };
  
    app.use(webpackDevMiddleware(compiler, serverConfig));
    app.use(webpackHotMiddleware(compiler));//hot module replacemente de todo el proyecto
  
  }

app.get('*', (request, response) => {//llamado al servidor, capturamos todas las rutas
    console.log("Hola mundo")
    response.send({ hello: 'express' })//retorna un json
});

app.listen(PORT, (err) => {//funcion anonima que recobe error
    if(err) console.err(err);
    else console.log("Server running on port 3000")
});