import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { addTokensSessionInterceptor } from './interceptors/add-tokens-session-interceptor';
import { cacheRequestsInterceptor } from './interceptors/cache-requests-interceptor';

//definicion del modulo de inyeccion de dependencias de angular
//objetos compartidos en toda la aplicacion
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), //<--- defincion del servicio de rutas de angular: "Router"
    //para habilitar la cadena de interceptores en el servicio HttpClient usamos funcion withInterceptors(), como parametro
    //le pasamos el array de interceptores que queremos habilitar en la aplicacion !!!OJO CON EL ORDEN DE LOS INTERCEPTORES EN EL ARRAY!!!
    provideHttpClient( withInterceptors([ ])), //<-- habilita servicio HttpClient para llamadas HTTP a backends para poder ser inyectado con ese array de interceptores: addTokensSessionInterceptor, cacheRequestsInterceptor
  ]
};
