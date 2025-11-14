import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
//import { App } from './app/app';
import { Registro } from './app/componentes/zonaCliente/Registro/registro';

bootstrapApplication(Registro, appConfig)
  .catch((err) => console.error(err));
