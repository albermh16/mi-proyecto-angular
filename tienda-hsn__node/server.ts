// modulo typescript de entrada en el proyecto nodejs
// leo fichero .env para cargar variables de entorno
import 'dotenv/config';

//importacion de express
import express,{ Express } from 'express';
import configurePipeline from './config_server_express/config_pipeline';
//nos creamos un servidor web express a partir del modulo express
const app:Express = express();

//configuramos la pipeline con middlewares del servidor para procesar peticiones entrantes del cliente de angular...
configurePipeline(app);

app.listen(3000,(err: any)=>{
    if(err){
        console.log('Error al iniciar el servidor:',err);
        return;
    }
    console.log('Servidor express iniciado en el puerto 3000');
});