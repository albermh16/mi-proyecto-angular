import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

//en el componente raiz App esta definido nuestro layout comun con un Header y Footer y el RouterOutlet
// para cargar los demas componentes segun la ruta
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
