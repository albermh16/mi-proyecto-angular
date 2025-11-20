"use strict";
//modulo de codigo typescript para configurar la pipeline de middlewares del servidor express
//exportamos una funcion que recibe el servidor express y configura la pipeline de middlewares
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = configurePipeline;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const endPointsCliente_1 = __importDefault(require("./config_enrutamiento/endPointsCliente"));
const endPointsTienda_1 = __importDefault(require("./config_enrutamiento/endPointsTienda"));
function configurePipeline(serverExpress) {
    //configuracion de la pipeline de middlewares del servidor express para procesar peticiones entrantes del cliente angular
    serverExpress.use((0, cookie_parser_1.default)()); //middleware para parsear cookies en las peticiones entrantes
    serverExpress.use(express_1.default.json()); //middleware para parsear cuerpos de peticiones en formato json
    serverExpress.use(express_1.default.urlencoded({ extended: false })); //middleware para parsear cuerpos de peticiones con datos codificados en URL
    serverExpress.use((0, cors_1.default)()); //middleware para permitir peticiones CORS desde el cliente angular
    serverExpress.use('api/Cliente', endPointsCliente_1.default); //middleware para gestionar rutas de API relacionadas con clientes
    serverExpress.use('api/Tienda', endPointsTienda_1.default); //middleware para gestionar rutas de API relacionadas con clientes
}
//# sourceMappingURL=config_pipeline.js.map