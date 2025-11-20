"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// modulo typescript de entrada en el proyecto nodejs
// leo fichero .env para cargar variables de entorno
require("dotenv/config");
//importacion de express
const express_1 = __importDefault(require("express"));
const config_pipeline_1 = __importDefault(require("./config_server_express/config_pipeline"));
//nos creamos un servidor web express a partir del modulo express
const app = (0, express_1.default)();
//configuramos la pipeline con middlewares del servidor para procesar peticiones entrantes del cliente de angular...
(0, config_pipeline_1.default)(app);
app.listen(3000, (err) => {
    if (err) {
        console.log('Error al iniciar el servidor:', err);
        return;
    }
    console.log('Servidor express iniciado en el puerto 3000');
});
//# sourceMappingURL=server.js.map