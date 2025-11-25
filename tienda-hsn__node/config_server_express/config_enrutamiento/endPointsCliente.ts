import express, { Router, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Cliente from '../../modelos/modelos_ORM_mongose/Cliente';
import bcrypt from 'bcrypt';
import { google } from 'googleapis';

//nos creamos un objeto router de express para gestionar rutas de API relacionadas con el cliente

const objetoRoutingCliente: Router = express.Router();

objetoRoutingCliente.post('/Registro', async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('datos mandados por el cliente ANGULAR en el cuerpo de la peticion POST / Registro:', req.body);
        const { nombre, apellidos, genero, email, password } = req.body;

        //1º Crear objeto cliente a partir de los datos recibidos en req.body segund esquema ORM de mongoose e insertarlo en la coleccion de clientes en mongodb
        await mongoose.connect(process.env.URI_MONGODB!);
        const nuevoCliente = new Cliente(
            {
                nombre,
                apellidos,
                genero,
                cuenta: {
                    email,
                    password: bcrypt.hashSync(password, 10),
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
        console.log("Resultado de la insercion del nuevo cliente en la BBDD mongodb:", resInsert);

        //2º Enviar correo de activacion de cuenta al email del cliente usando servicio de email (nodemailer + servicio externo smtp)

        //3º Responder al cliente angular con codigo exito o error
        res.status(200).send({ codigo: 0, mensaje: 'Registro procesado correctamente' });

    } catch (error) {
        console.log('Error en el endpoint /Registro:', error);
        res.status(200).send({ codigo: 1, mensaje: 'Error en el servidor al procesar el registro' });
    }
});

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH2_CLIENT_ID,
    process.env.GOOGLE_OAUTH2_CLIENT_SECRET,
    process.env.GOOGLE_OAUTH2_REDIRECT_URI
);

const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/user.phonenumbers.read',
        'https://www.googleapis.com/auth/user.addresses.read',
        'https://www.googleapis.com/auth/user.gender.read'
    ]
});

objetoRoutingCliente.get('/LoginGoogleCallback', async (req:Request, res:Response, next:NextFunction)=>{
        try{
            // ---- google nos manda a esta ruta con un codigo en querystring, usamos ese codigo para pedir el token de acceso a las APIS de google

            const code:string = req.query.code as string;

            console.log('Callback de Google OAuth2 recibido con code:', code);
            if(!code) throw new Error('Falta código de autorización en callback de Google');
            
            const { tokens } = await oauth2Client.getToken(code);
            console.log('Tokens obtenidos de Google:', tokens);

            /*
            formato de tokens:
                {
                access_token: 'ya29.a0ATi6K2vos-Q72jHgY1_UiLWFdvmCbQO-KtNNseY0MZivr7iFIZuZWChRTnFxePsQJMaRZrxjBQx1nXuODUorXn-2TKZHAAvFw0oEjugn2HIALUljdKCWtFXkddvvIZNJx_4s6h2SbC4cr5dPrb-9cRwoi4RhmprRl2PRaYOKHw8m7WeGeYQTFRD7Si64SKhL-SQDxZwaCgYKAY0SARASFQHGX2MiXg4jLoELQIdt8vdymxbc-g0206',
                refresh_token: '1//03WMLk480k1l-CgYIARAAGAMSNwF-L9IrTM9jQRb7HR1euz_XuzUfnLQyS2WFYaTSb0ZMHwEGuKDrCizLV960yauCPBCcCmD0ms0',
                scope: 'https://www.googleapis.com/auth/user.addresses.read openid https://www.googleapis.com/auth/user.gender.read https://www.googleapis.com/auth/user.phonenumbers.read https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
                token_type: 'Bearer',
                id_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImI1ZTQ0MGFlOTQxZTk5ODFlZTJmYTEzNzZkNDJjNDZkNzMxZGVlM2YiLCJ0eXAiOiJKV1QifQ.eyJpc3M......_4EnKcdSQnw',
                refresh_token_expires_in: 604799,
                expiry_date: 1762362921816
                }            
            */

            // ---- Usar el token de acceso para obtener info del usuario desde la API de Google: People API o UserInfo API

            oauth2Client.setCredentials(tokens);

            const peopleService = google.people({ version: 'v1', auth: oauth2Client });
            const reqProfile = await peopleService.people.get({
                resourceName: 'people/me',
                personFields: 'names,emailAddresses,phoneNumbers,addresses,genders,photos,birthdays,organizations'
            });
            console.log('Datos del perfil de usuario obtenidos de Google People API:', reqProfile.data);

            // ---- Procesar los datos del perfil de usuario obtenidos de Google (reqProfile.data)
            // Aquí iría la lógica para registrar o autenticar al usuario en nuestra aplicación
            res.status(200).send('Login con Google exitoso. Puedes cerrar esta ventana.');
        }catch(error){
            console.log('Error en el endpoint /LoginGoogleCallback:', error);
            res.status(500).send('Error en el servidor al procesar el login con Google.');
        }
});




export default objetoRoutingCliente;