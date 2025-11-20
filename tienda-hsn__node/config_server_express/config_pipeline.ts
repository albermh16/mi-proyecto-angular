//modulo de codigo typescript para configurar la pipeline de middlewares del servidor express
//exportamos una funcion que recibe el servidor express y configura la pipeline de middlewares

import cookieParser from 'cookie-parser';
import express,  { Express } from 'express';
import cors from 'cors';
import objetoRoutingCliente from './config_enrutamiento/endPointsCliente';
import objetoRoutingTienda from './config_enrutamiento/endPointsTienda';

export default function configurePipeline(serverExpress:Express):void{
    //configuracion de la pipeline de middlewares del servidor express para procesar peticiones entrantes del cliente angular

    serverExpress.use(cookieParser()); //middleware para parsear cookies en las peticiones entrantes

    serverExpress.use(express.json()); //middleware para parsear cuerpos de peticiones en formato json
    
    serverExpress.use(express.urlencoded({ extended: false })); //middleware para parsear cuerpos de peticiones con datos codificados en URL

    serverExpress.use(cors()); //middleware para permitir peticiones CORS desde el cliente angular

    serverExpress.use('api/Cliente', objetoRoutingCliente); //middleware para gestionar rutas de API relacionadas con clientes
    serverExpress.use('api/Tienda', objetoRoutingTienda); //middleware para gestionar rutas de API relacionadas con clientes
    
}