import { HttpEvent, HttpEventType, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

//los interceptores son funciones que se ejecutan antes de enviar una solicitud HTTP por parte del servicio HttpClient
// y después de recibir una respuesta HTTP por parte del backend. Son funciones que reciben 2 parametros:
// - req: objeto HttpRequest <---- objeto q representa la solicitud HTTP que le llega al intercpetor y q puedo modificar antes de enviarla
//                          al siguiente interceptor o al backend. 
//                OJO!!! si quiero modificar la solicitud, debo crear una nueva copia o instancia
//                          del objeto HttpRequest con las modificaciones deseadas, ya que los objetos HttpRequest son inmutables. Para hacerlo
//                          uso el metodo .clone() del objeto HttpRequest.
// - next: funcion que sirve para pasar la peticion al siguiente interceptor en la cadena de interceptores o al backend si no hay mas
//  interceptores. Esta funcion devuelve un OBSERVABLE con los diferentes eventos HTTP que se producen en el procesamiento de la solicitud HTTP,
//  incluyendo la respuesta HTTP final. Es un proceso asincrono, no es inmediato, por eso devuelve un observable

export const addTokensSessionInterceptor: HttpInterceptorFn = (req:HttpRequest<any>, next:HttpHandlerFn):Observable<HttpEvent<any>> => {
  //modificamos la solicitud original para agregarle los tokens de session si existen
  //const globalStateService = inject(GlobalStateService); // <---- deberia inyectar el servicio global-state
  const accessToken: string | null = 'adfsafsfdsa'; // <---- deberia recoger el token desde el servicio global-state
  const refreshToken: string | null = 'adfsafsafd';// <---- deberia recoger el token desde el servicio global-state
  
  if (accessToken && refreshToken) {
    //clonamos la solicitud original y le agregamos los tokens a cabeceras Authorization Bearer y X-Refresh-Token
    req=req.clone(
                  {
                    headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
                                        .set('X-Refresh-Token', refreshToken)
                  }
              )
  }
  //para transformar/operar sobre los datos de un observable debo usar los operdores de rxjs, SIEMPRE DENTRO DEL METODO .pipe()
  return next(req).pipe(
    //lista de operadores rxjs que quiero aplicar al observable devuelto por next(req)
    //tap <--- operador que recoje el valor del observable, ejecuta la funcion con ese valor, pero lo devuelve sin modificar
    tap( ( ev:HttpEvent<any> ) => console.log('evento HTTP de procesamiento respuesta en INTERCEPTOR...',ev)),
    //map <------ operador que recoje el valor del observable, ejecuta la fucion con ese valor y lo modifica, devolviendo
    //          el nuevo valor modificado al siguiente operador o al suscriptor final
    map( ( ev:HttpEvent<any> ) => { 
        if(ev.type===HttpEventType.Response){
          //de la respuesta q me llega del servidor de node: { codigo:..., mensaje:..., datos: ...}
          //solo quiero devolver los datos:
          const nuevoEventoRespuesta:HttpEvent<any> = ev.clone( { body: ev.body.datos } );
          return nuevoEventoRespuesta;
    }
    return ev;
  }
  )
    //concatMap
    //mergeMap
    //switchMap
  );
};
