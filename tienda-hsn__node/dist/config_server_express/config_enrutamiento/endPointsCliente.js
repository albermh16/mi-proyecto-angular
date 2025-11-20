"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const Cliente_1 = __importDefault(require("../../modelos/modelos_ORM_mongose/Cliente"));
const bcrypt_1 = __importDefault(require("bcrypt"));
//nos creamos un objeto router de express para gestionar rutas de API relacionadas con el cliente
const objetoRoutingCliente = express_1.default.Router();
objetoRoutingCliente.post('/Registro', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('datos mandados por el cliente ANGULAR en el cuerpo de la peticion POST / Registro:', req.body);
        const { nombre, apellidos, genero, email, password } = req.body;
        //1º Crear objeto cliente a partir de los datos recibidos en req.body segund esquema ORM de mongoose e insertarlo en la coleccion de clientes en mongodb
        yield mongoose_1.default.connect(process.env.URI_MONGODB);
        const nuevoCliente = new Cliente_1.default({
            nombre,
            apellidos,
            genero,
            cuenta: {
                email,
                password: bcrypt_1.default.hashSync(password, 10),
                fechaCreacionCuenta: Date.now(),
                cuentaActiva: false,
                imagenAvatar: '',
                telefonoContacto: '',
                tipoCuenta: 'particular'
            },
            nifcif: '',
            fechaNacimiento: Date.now(),
            direcciones: [],
            pedidos: [],
            listaFavoritos: [],
            metodosPago: [],
            opiniones: []
        });
        //insertar el nuevo cliente en la coleccion de clientes en mongodb
        const resInsert = yield nuevoCliente.save();
        console.log("Resultado de la insercion del nuevo cliente en la BBDD mongodb:", resInsert);
        //2º Enviar correo de activacion de cuenta al email del cliente usando servicio de email (nodemailer + servicio externo smtp)
        //3º Responder al cliente angular con codigo exito o error
        res.status(200).send({ codigo: 0, mensaje: 'Registro procesado correctamente' });
    }
    catch (error) {
        console.log('Error en el endpoint /Registro:', error);
        res.status(200).send({ codigo: 1, mensaje: 'Error en el servidor al procesar el registro' });
    }
}));
exports.default = objetoRoutingCliente;
//# sourceMappingURL=endPointsCliente.js.map