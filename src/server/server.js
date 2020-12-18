/* eslint-disable block-spacing */
/* eslint-disable eol-last */
/* eslint-disable quotes */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import express from 'express';
import dotenv from 'dotenv';
import webpack from 'webpack';
//se reusaran las siguientes librerias:
import React from 'react';
import { renderToString } from 'react-dom/server';//convertir app en string
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { renderRoutes } from 'react-router-config';//recibe un array de rutas
import { StaticRouter } from 'react-router-dom';
import helmet from 'helmet';
import reducer from '../frontend/reducers';
import initialState from '../frontend/initialState';
import serverRoutes from '../frontend/routes/serverRoutes';

dotenv.config();//busca en el proyecto un archivo .env y toma sus variables

//definimos 2 contantes que seran el entorno y el puerto de .env
const { ENV, PORT } = process.env;

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
} else {
    app.use(express.static(`${__dirname}/public`));
    app.use(helmet());
    app.use(helmet.permittedCrossDomainPolicies());
    app.disable('x-powered-by');
}

const setResponse = (html, preloadedState) => {
  return (`<!DOCTYPE html>
            <html>
              <head>
                <link rel="stylesheet" href="assets/app.css" type="text/css">
                <title>Platzi Video</title>
              </head>
              <body>
                <div id="app">${html}</div>
                <script>
                window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
                </script>
                <script src="assets/app.js" type="text/javascript"></script>
              </body>
            </html>`);
};

const renderApp = (request, response) => {
  const store = createStore(reducer, initialState);
  const preloadedState = store.getState();
  const html = renderToString(//llamamos al provider
    <Provider store={store}>
      <StaticRouter location={request.url} context={{}}>
        { renderRoutes(serverRoutes) }
      </StaticRouter>
    </Provider>,
  );
  response.send(setResponse(html, preloadedState));
};

app.get('*', renderApp);//llamado al servidor, capturamos todas las rutas

app.listen(PORT, (err) => {//funcion anonima que recobe error
    if (err) console.err(err);
    else console.log("Server running on port 3000");
});