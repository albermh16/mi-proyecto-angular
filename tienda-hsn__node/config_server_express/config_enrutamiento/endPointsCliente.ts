import express, { Router, Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
import Cliente from '../../modelos/modelos_ORM_mongose/Cliente';
import bcrypt from 'bcrypt';

//nos creamos un objeto router de express para gestionar rutas de API relacionadas con el cliente

const objetoRoutingCliente:Router = express.Router();

objetoRoutingCliente.post('/Registro', async(req:Request,res:Response, next:NextFunction)=>{
    try{
        console.log('datos mandados por el cliente ANGULAR en el cuerpo de la peticion POST / Registro:',req.body);
        const { nombre, apellidos, genero, email, password } = req.body;

        //1º Crear objeto cliente a partir de los datos recibidos en req.body segund esquema ORM de mongoose e insertarlo en la coleccion de clientes en mongodb
        await mongoose.connect(process.env.URI_MONGODB!);
        const nuevoCliente =  new Cliente(
            {
                nombre,
                apellidos,
                genero,
                cuenta: {
                    email,
                    password: bcrypt.hashSync(password,10),
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
            }
        );

        //insertar el nuevo cliente en la coleccion de clientes en mongodb
        const resInsert = await nuevoCliente.save();
        console.log("Resultado de la insercion del nuevo cliente en la BBDD mongodb:",resInsert);

        //2º Enviar correo de activacion de cuenta al email del cliente usando servicio de email (nodemailer + servicio externo smtp)

        //3º Responder al cliente angular con codigo exito o error
        res.status(200).send( { codigo:0, mensaje:'Registro procesado correctamente' } );

    }catch(error){
        console.log('Error en el endpoint /Registro:',error);
        res.status(200).send( { codigo:1, mensaje:'Error en el servidor al procesar el registro' } );
    }
});

export default objetoRoutingCliente;