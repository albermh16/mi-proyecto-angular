"use strict";
//Definicion schema mongoose para crear objetos "Cliente" que se mapean contra documentos de la coleccion clientes de la BBDD mongodb
//OJO!!! La definicion de las propiedades a mapear en el esquema de mongoose los tipos no son tipos typescript sino tipos de mongoose
// sino 
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const esquemaCuenta = new mongoose_1.default.Schema({
    email: { type: String, required: true, default: '' },
    password: { type: String, required: true, default: '' },
    fechaCreacionCuenta: { type: Number, required: true },
    cuentaActiva: { type: Boolean, required: true, default: false },
    imagenAvatar: String,
    telefonoContacto: String,
    tipoCuenta: { type: String, required: true, default: 'Particular' } //Particular o Empresa
});
const esquemaCliente = new mongoose_1.default.Schema({
    nombre: { type: String, required: true, default: '' },
    apellidos: { type: String, required: true, default: '' },
    genero: { type: String, required: true, default: 'Hombre' },
    cuenta: { type: esquemaCuenta, required: true },
    nifcif: { type: String, required: true, default: '' },
    fechaNacimiento: Number,
    direcciones: [],
    pedidos: [],
    listaFavoritos: [],
    metodosPago: [],
    opiniones: [],
});
// El metodo mongoose.model() crea y exporta el model ORM de mongoose
// - El primer parametro es el NOMBRE DEL MODEL u objetos de clase a crear (clase Cliente)
// - El segundo parametro es el esquema mongoose que define la estructura de los documentos en la coleccion
// - El tercer parametro es el NOMBRE DE LA COLECCION en la BBDD mongodb donde se van a guardar los documentos
exports.default = mongoose_1.default.model('Cliente', esquemaCliente, 'clientes'); //nombre modelo, esquema mongoose, nombre coleccion en mongodb
//# sourceMappingURL=Cliente.js.map